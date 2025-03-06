export const useFetchBooth = async (id: number): Promise<Item | null> => {
    if (!id) return null;

    const response = await $fetch<ApiResponse<Item>>('/api/item/booth', {
        method: 'GET',
        query: { id: encodeURIComponent(id) },
    });

    if (!response.data || response.data?.outdated) return null;
    return response.data;
};
