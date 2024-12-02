import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';

let client: SupabaseClient | undefined;

export const useSBClient = async () => {
    if (!client) {
        client = await useSupabaseClient<Database>();
    }
    return client;
};
