export const useUploadAvatar = async (file: File) => {
    const runtimeConfig = useRuntimeConfig();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("res", "128");
    formData.append("size", "80");
    formData.append("path", "avatar");

    try {
        const response: { data: PutImage; error: unknown } = await $fetch(
            "/api/PutBlobImage",
            {
                method: "POST",
                headers: {
                    Authorization: runtimeConfig.public.token,
                },
                body: formData,
            }
        );
        if (response.error) {
            throw new Error(response.error.toString());
        }
        return response.data.path;
    } catch (error) {
        console.error("Failed to upload avatar:", error);
        return null;
    }
};

export const usePostImage = async (file: File) => {
    const runtimeConfig = useRuntimeConfig();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("res", "1024");
    formData.append("size", "80");

    try {
        const response: { data: PutImage; error: unknown } = await $fetch(
            "/api/PutBlobImage",
            {
                method: "POST",
                headers: {
                    Authorization: runtimeConfig.public.token,
                },
                body: formData,
            }
        );
        if (response.error) {
            throw new Error(response.error.toString());
        }
        return response.data.path;
    } catch (error) {
        console.error("Failed to upload image:", error);
        return null;
    }
};

export interface PutImage {
    id: string;
    path: string;
    fullPath: string;
}

export const useGetImage = async (path: string) => {
    const runtimeConfig = useRuntimeConfig();

    const url = `/api/ServeBlobImage?path=${encodeURIComponent(path)}`;

    try {
        const response: any = await $fetch(url, {
            method: "GET",
            headers: {
                Authorization: runtimeConfig.public.token,
            },
        });
        return response;
    } catch (error) {
        console.error("Failed to fetch item data:", error);
        return null;
    }
};
