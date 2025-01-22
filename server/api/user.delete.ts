import {
    serverSupabaseServiceRole,
    serverSupabaseUser,
} from '#supabase/server';
import type { User } from '@supabase/supabase-js';

export default defineEventHandler(async (event) => {
    let user: User | null;
    try {
        user = await serverSupabaseUser(event);
        if (!user) throw new Error();
    } catch {
        return {
            error: { status: 403, message: 'Forbidden.' },
            data: null,
        };
    }

    const supabase = serverSupabaseServiceRole(event);

    const body = await readBody(event);
    const plainPassword = body.plainPassword;

    const { data: checkPasswordResult, error: checkPasswordError } =
        await supabase.rpc('check_password', {
            user_id: user.id,
            plain_password: plainPassword,
        });

    if (checkPasswordError) {
        console.error(checkPasswordError);
        return sendError(
            event,
            createError({
                statusCode: 500,
                statusMessage: 'Error on checking password.',
            })
        );
    }

    if (!checkPasswordResult) {
        console.error('Invalid password');
        return sendError(
            event,
            createError({ statusCode: 401, statusMessage: 'Invalid password' })
        );
    }

    const { data, error } = await supabase.auth.admin.deleteUser(user.id);

    if (error) {
        console.error(error);
        return sendError(
            event,
            createError({
                statusCode: 500,
                statusMessage: 'Error on deleting user.',
            })
        );
    }

    return data;
});
