// NUXT_PUBLIC_TOKENを.envに設定
import { serverSupabaseServiceRole } from '#supabase/server';

export default defineEventHandler(async (event) => {
    const token = getHeader(event, 'authorization');
    const supabase = serverSupabaseServiceRole(event);

    const user = await supabase.auth.getUser(token);

    if (!user.data.user) {
        console.log('Request rejected');
        return sendError(
            event,
            createError({ statusCode: 403, statusMessage: 'Forbidden' })
        );
    }
});
