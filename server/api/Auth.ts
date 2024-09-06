// NUXT_PUBLIC_TOKENを.envに設定
export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig(event);
    const token = getHeader(event, "authorization");

    if (token != runtimeConfig.public.token) {
        console.log("Request rejected");
        return sendError(
            event,
            createError({ statusCode: 403, statusMessage: "Forbidden" })
        );
    }
});
