export const useUploadAvatar = async (file: File) => {
    const runtimeConfig = useRuntimeConfig();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("res", "256");
    formData.append("size", "100");
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
    formData.append("res", "1280");
    formData.append("size", "200");

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
            console.error(response.error);
            throw new Error();
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

export const useGetImage = (path: string) => {
    const runtimeConfig = useRuntimeConfig();
    return `${runtimeConfig.public.r2Domain}/${path}`;
};
