import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';
import type { ApiResponse } from '~/types';
import getErrors, { type ErrorType } from '~/utils/getErrors';
import setupLimits from '~/utils/setupLimits';

export interface RequestBody {
    name: string;
    description: string;
    tags: string[];
    coAuthors: { id: string; note: string }[];
    image: string | null;
    items: { id: number; note: string; unsupported: boolean }[];
}

const returnError = (error: ErrorType) => ({ error, data: null });

export default defineEventHandler(
    async (event): Promise<ApiResponse<{ id: number }>> => {
        const user = await serverSupabaseUser(event).catch(() => null);
        if (!user) return { error: getErrors().general.forbidden, data: null };

        const supabase = await serverSupabaseClient(event);
        const body: RequestBody = await readBody(event);
        const limits = setupLimits();
        const {
            description: limitDescription,
            tags: limitTags,
            coAuthors: limitCoAuthors,
            avatars: limitAvatars,
            items: limitItems,
        } = limits;

        if (!body.name?.length)
            return returnError(getErrors().publishSetup.noTitle);
        if (body.description && body.description.length > limitDescription)
            return returnError(getErrors().publishSetup.tooLongDescription);
        if (body.tags.length > limitTags)
            return returnError(getErrors().publishSetup.tooManyTags);
        if (body.coAuthors.length > limitCoAuthors)
            return returnError(getErrors().publishSetup.tooManyCoAuthors);

        const { data: itemsDB } = await supabase
            .from('items')
            .select('id, category')
            .in(
                'id',
                body.items.map((i) => i.id)
            );
        if (!itemsDB)
            return returnError(getErrors().publishSetup.itemCheckFailed);

        const itemsInfo = itemsDB.reduce(
            (acc, item) => ({ ...acc, [item.id]: item.category }),
            {} as Record<number, 'avatar' | 'cloth' | 'accessory' | 'other'>
        );

        const avatarItems = body.items.filter(
            (i) => itemsInfo[i.id] === 'avatar'
        );
        const nonAvatarItems = body.items.filter(
            (i) => itemsInfo[i.id] !== 'avatar'
        );

        if (!avatarItems.length)
            return returnError(getErrors().publishSetup.noAvatar);
        if (avatarItems.length > limitAvatars)
            return returnError(getErrors().publishSetup.tooManyAvatars);
        if (!nonAvatarItems.length)
            return returnError(getErrors().publishSetup.noItems);
        if (nonAvatarItems.length > limitItems)
            return returnError(getErrors().publishSetup.tooManyItems);

        let image: {
            path: string;
            prefix: string;
            width?: number;
            height?: number;
        } | null = null;

        if (body.image) {
            const response = await event.$fetch<
                ApiResponse<{
                    path: string;
                    prefix: string;
                    width?: number;
                    height?: number;
                }>
            >('/api/image', {
                method: 'PUT',
                body: {
                    image: body.image,
                    resolution: 1920,
                    size: 1500,
                    prefix: 'setup',
                },
            });
            if (!response.data)
                return returnError(getErrors().publishSetup.uploadImage);
            image = response.data;
        }

        const { data: setupData, error: setupError } = await supabase
            .from('setups')
            .insert({
                name: body.name,
                description: body.description,
            })
            .select('id')
            .single();
        if (setupError)
            return returnError(getErrors().publishSetup.insertSetup);

        // 複数テーブルへの挿入処理は並行実行可能
        const insertOperations = [
            supabase.from('setup_items').insert(
                body.items.map((i) => ({
                    setup_id: setupData.id,
                    item_id: i.id,
                    note: i.note,
                    unsupported: i.unsupported,
                }))
            ),
            supabase
                .from('setup_tags')
                .insert(
                    body.tags.map((tag) => ({ setup_id: setupData.id, tag }))
                ),
            supabase.from('setup_coauthors').insert(
                body.coAuthors.map((coauthor) => ({
                    setup_id: setupData.id,
                    user_id: coauthor.id,
                    note: coauthor.note,
                }))
            ),
        ];
        const [
            { error: itemsError },
            { error: tagsError },
            { error: coAuthorError },
        ] = await Promise.all(insertOperations);

        if (itemsError)
            return returnError(getErrors().publishSetup.insertItems);
        if (tagsError) return returnError(getErrors().publishSetup.insertTags);
        if (coAuthorError)
            return returnError(getErrors().publishSetup.insertCoAuthors);

        if (image) {
            const { error: imageError } = await supabase
                .from('setup_images')
                .insert({
                    name: image.path,
                    setup_id: setupData.id,
                    width: image.width,
                    height: image.height,
                });
            if (imageError)
                return returnError(getErrors().publishSetup.insertImages);
        }

        return { error: null, data: { id: setupData.id } };
    }
);
