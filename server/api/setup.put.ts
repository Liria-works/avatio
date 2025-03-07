import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';

export interface RequestBody {
    name: string;
    description: string;
    tags: string[];
    coAuthors: { id: string; note: string }[];
    image: string | null;
    unity?: string;
    items: {
        id: number;
        category: ItemCategory;
        note: string;
        unsupported: boolean;
    }[];
}

const returnError = (error: ErrorType) => ({ error, data: null });

export default defineEventHandler(
    async (
        event
    ): Promise<ApiResponse<{ id: number; image: string | null }>> => {
        const user = await serverSupabaseUser(event).catch(() => null);
        if (!user) return { error: getErrors().general.forbidden, data: null };

        const supabase = await serverSupabaseClient(event);
        const body: RequestBody = await readBody(event);
        const limits = setupLimits();
        const {
            description: limitDescription,
            tags: limitTags,
            coAuthors: limitCoAuthors,
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

        if (!body.items.length)
            return returnError(getErrors().publishSetup.noItems);
        if (body.items.length > limitItems)
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
                unity: body.unity?.length ? body.unity : null,
            })
            .select('id')
            .single();
        if (setupError)
            return returnError(getErrors().publishSetup.insertSetup);

        const insertOperations = [
            supabase.from('setup_items').insert(
                body.items.map((i) => ({
                    setup_id: setupData.id,
                    item_id: i.id,
                    note: i.note,
                    unsupported: i.unsupported,
                    category: i.category,
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

        return {
            error: null,
            data: { id: setupData.id, image: image ? image.path : null },
        };
    }
);
