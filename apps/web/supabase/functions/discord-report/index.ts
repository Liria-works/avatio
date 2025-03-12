import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js';
import { createBot } from 'npm:discordeno';

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
        .neq('dealt', true)
        .lt('created_at', now.toISOString())
        .gt('created_at', yesterday.toISOString());

    const { data: reportSetupData, error: reportSetupError } = await supabase
        .from('report_setup')
        .select('*')
        .neq('dealt', true)
        .lt('created_at', now.toISOString())
        .gt('created_at', yesterday.toISOString());

    const { data: reportUserData, error: reportUserError } = await supabase
        .from('report_user')
        .select('*')
        .neq('dealt', true)
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

    const contents: string[] = [];

    if (response.feedback.error)
        contents.push('1. 取得に失敗 : フィードバック');
    if (response.feedback.number !== 0)
        contents.push(
            `1. 送信されたフィードバック: **${response.feedback.number}**`
        );

    if (response.report.setup.error)
        contents.push('2. 取得に失敗 : セットアップ報告');
    if (response.report.setup.number !== 0)
        contents.push(
            `1. 送信されたセットアップ報告: **${response.report.setup.number}**`
        );

    if (response.report.user.error)
        contents.push('3. 取得に失敗 : ユーザー報告');
    if (response.report.user.number !== 0)
        contents.push(
            `1. 送信されたユーザー報告: **${response.report.user.number}**`
        );

    const message =
        '**Avatio**\n\n' +
        'この24時間のレポート\n' +
        `${yesterday.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })} -> ${now.toLocaleString(
            'ja-JP',
            { timeZone: 'Asia/Tokyo' }
        )}\n\n` +
        contents.join('\n');

    if (contents.length) {
        await basebot.helpers.sendMessage(
            Deno.env.get('DISCORD_BOT_CHANNEL_ID')!,
            { content: message }
        );
    }

    return new Response(
        JSON.stringify({ message: 'Successfully sent message' }),
        { headers: { 'Content-Type': 'application/json' } }
    );
});
