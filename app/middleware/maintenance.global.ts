export default defineNuxtRouteMiddleware(async (_to, _from) => {
    if (import.meta.server) return;
    let env: string | undefined;
    try {
        env = process?.env?.NODE_ENV;
    } catch {
        env = 'production';
    }

    const isMaintenance = (
        await $fetch(
            `/api/edgeConfig/${env === 'development' ? 'isMaintenanceDev' : 'isMaintenance'}`
        )
    ).value;

    if (isMaintenance) {
        if (_to.path !== '/on-maintenance')
            return navigateTo('/on-maintenance');
    } else {
        if (_to.path === '/on-maintenance') return navigateTo('/');
    }
});
