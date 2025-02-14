import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';
import type { ApiResponse } from '~/types';
import getErrors, { type ErrorType } from '~/utils/getErrors';

export interface RequestBody {
    name: string;
    description: string;
    tags: string[];
    image: string | null;
    items: { id: number; note: string; unsupported: boolean }[];
}

const returnError = (error: ErrorType) => {
    return {
        error: error,
        data: null,
    };
};

export default defineEventHandler(
    async (event): Promise<ApiResponse<{ id: number }>> => {
        try {
            const user = await serverSupabaseUser(event);
            if (!user) throw new Error();
        } catch {
            return { error: getErrors().general.forbidden, data: null };
        }

        const supabase = await serverSupabaseClient(event);
        const body: RequestBody = await readBody(event);

        if (!body.name || !body.name.length)
            return returnError(getErrors().publishSetup.noTitle);

        if (body.description && body.description.length > 140)
            return returnError(getErrors().publishSetup.tooLongDescription);

        if (body.tags.length > 8)
            return returnError(getErrors().publishSetup.tooManyTags);

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

        if (!body.items.filter((i) => itemsInfo[i.id] === 'avatar').length)
            return returnError(getErrors().publishSetup.noAvatar);
        if (body.items.filter((i) => itemsInfo[i.id] === 'avatar').length > 1)
            return returnError(getErrors().publishSetup.tooManyAvatars);
        if (!body.items.filter((i) => itemsInfo[i.id] !== 'avatar').length)
            return returnError(getErrors().publishSetup.noItems);
        if (body.items.filter((i) => itemsInfo[i.id] !== 'avatar').length > 32)
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

        const { error: itemsError } = await supabase.from('setup_items').insert(
            body.items.map((i) => {
                return {
                    setup_id: setupData.id,
                    item_id: i.id,
                    note: i.note,
                    unsupported: i.unsupported,
                };
            })
        );

        if (itemsError)
            return returnError(getErrors().publishSetup.insertItems);

        const { error: tagsError } = await supabase.from('setup_tags').insert(
            body.tags.map((i) => {
                return {
                    setup_id: setupData.id,
                    tag: i,
                };
            })
        );

        if (tagsError) return returnError(getErrors().publishSetup.insertTags);

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

        return {
            error: null,
            data: { id: setupData.id },
        };
    }
);
