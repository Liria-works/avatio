export default defineNuxtRouteMiddleware(async (_to, _from) => {
    if (import.meta.server) return;

    const isMaintenance = await $fetch('/api/edgeConfig');
    if (isMaintenance.value?.is_maintenance)
        return showError({
            statusCode: 503,
            message: 'メンテナンス中です',
        });
});
