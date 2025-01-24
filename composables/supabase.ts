import type { SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | undefined;

export const useSBClient = async () => {
    if (!client) client = await useSupabaseClient();
    return client;
};
