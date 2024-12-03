import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import {
    createBot,
    sendMessage,
} from 'https://deno.land/x/discordeno@20.0.0/mod.ts';

const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const basebot = await createBot({
    token: Deno.env.get('DISCORD_BOT_TOKEN')!,
    events: {
        ready() {
            console.log('Successfully connected to gateway');
        },
    },
});

const now: Date = new Date();
const yesterday: Date = new Date();
yesterday.setDate(yesterday.getDate() - 1);

Deno.serve(async () => {
    const { data: feedbackData, error: feedbackError } = await supabase
        .from('feedback')
        .select('*')
        .lt('created_at', now.toISOString())
        .gt('created_at', yesterday.toISOString());

    const { data: reportSetupData, error: reportSetupError } = await supabase
        .from('report_setup')
        .select('*')
        .lt('created_at', now.toISOString())
        .gt('created_at', yesterday.toISOString());

    const { data: reportUserData, error: reportUserError } = await supabase
        .from('report_user')
        .select('*')
        .lt('created_at', now.toISOString())
        .gt('created_at', yesterday.toISOString());

    const response = {
        feedback: {
            number: feedbackData ? feedbackData.length : 0,
            error: feedbackError,
        },
        report: {
            setup: {
                number: reportSetupData ? reportSetupData.length : 0,
                error: reportSetupError,
            },
            user: {
                number: reportUserData ? reportUserData.length : 0,
                error: reportUserError,
            },
        },
    };

    const contents = [
        response.feedback.number &&
            `1. 送信されたフィードバック: **${
                response.feedback.error
                    ? 'フィードバックの取得に失敗'
                    : response.feedback.number
            }**`,
        response.report.setup.number &&
            `1. 送信されたセットアップ報告: **${
                response.report.setup.error
                    ? 'セットアップ報告の取得に失敗'
                    : response.report.setup.number
            }**`,
        response.report.user.number &&
            `1. 送信されたユーザー報告: **${
                response.report.user.error
                    ? 'ユーザー報告の取得に失敗'
                    : response.report.user.number
            }**`,
    ];

    const message =
        '**Avatio**\n\n' +
        'この24時間のレポート\n' +
        `${yesterday.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })} -> ${now.toLocaleString(
            'ja-JP',
            { timeZone: 'Asia/Tokyo' }
        )}\n\n` +
        contents.join('\n');

    if (contents.length) {
        await sendMessage(basebot, Deno.env.get('DISCORD_BOT_CHANNEL_ID')!, {
            content: message,
        });
    }

    return new Response(
        JSON.stringify({ message: 'Successfully sent message' }),
        { headers: { 'Content-Type': 'application/json' } }
    );
});
