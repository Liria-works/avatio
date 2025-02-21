export default defineNuxtRouteMiddleware(async (_to, _from) => {
    if (import.meta.server) return;
    let env: string | undefined;
    try {
        env = process?.env?.NODE_ENV;
    } catch {
        env = 'production';
    }
    if (env === 'development') return;

    const isMaintenance = await $fetch('/api/edgeConfig');
    if (isMaintenance.value?.isMaintenance)
        return showError({
            statusCode: 503,
            message: 'メンテナンス中です',
        });
});
