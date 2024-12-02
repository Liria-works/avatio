// NUXT_PUBLIC_TOKENを.envに設定
import { serverSupabaseServiceRole } from '#supabase/server';
import type { Database } from '../../database.types';

export default defineEventHandler(async (event) => {
    const supabase = serverSupabaseServiceRole<Database>(event);

    const token = getHeader(event, 'authorization');
    const user = await supabase.auth.getUser(token);

    if (!user.data.user) return false;

    return true;
});
