export const useGetOwnedAvatars = async (): Promise<
    { id: number; name: string; thumbnail: string }[] | null
> => {
    const client = await useSBClient();
    const user = useSupabaseUser();

    if (!user.value) {
        return null;
    }

    const { data, error } = await client
        .from("setups")
        .select("avatar")
        .eq("author", user.value.id);

    if (!error) {
        const response = [];

        let owned = data.map((obj: { avatar: number }) => obj.avatar);
        owned = [...new Set(owned)];

        for (const i of owned) {
            const result = await useFetchBooth(Number(i));
            if (!result) {
                continue;
            }
            response.push({
                id: result.id,
                name: result.name,
                thumbnail: result.thumbnail,
            });
        }
        return response;
    } else {
        console.error(error);
        return null;
    }
};

export const useGetPopularAvatars = async (): Promise<
    { id: number; name: string; thumbnail: string }[] | null
> => {
    const client = await useSBClient();

    const { data, error } = await client.rpc("avatars_order_by_count");

    if (!error) {
        const response = [];

        for (const key in data) {
            const result = await useFetchBooth(data[key].avatar);
            if (!result) {
                continue;
            }
            response.push({
                id: result.id,
                name: result.name,
                thumbnail: result.thumbnail,
            });
        }

        return response;
    } else {
        console.error(error);
        return null;
    }
};
