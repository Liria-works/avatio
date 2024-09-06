// eslint-disable-next-line @typescript-eslint/no-explicit-any
let client: any;

export const useSBClient = async () => {
    if (!client) {
        client = await useSupabaseClient();
    }
    return client;
};
