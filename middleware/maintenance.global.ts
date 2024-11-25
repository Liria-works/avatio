export default defineNuxtRouteMiddleware(async (_to, _from) => {
    const isMaintenance = await $fetch('/api/edgeConfig');
    if (isMaintenance.value?.is_maintenance)
        return showError({
            statusCode: 503,
            statusMessage: 'Now in maintenance',
        });
});
