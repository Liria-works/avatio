export const useGetImage = (path: string) => {
    const runtime = useRuntimeConfig();
    return `${runtime.public.r2Domain}/${encodeURIComponent(path)}`;
};

export const useUploadAvatar = async (file: File) => {
    const runtime = useRuntimeConfig();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("res", "512"); // 512x512
    formData.append("size", "300"); // 300KB
    formData.append("path", "avatar");

    try {
        const response: { data: PutImage; error: unknown } = await $fetch(
            "/api/PutBlobImage",
            {
                method: "POST",
                headers: {
                    Authorization: runtime.public.token,
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
    const runtime = useRuntimeConfig();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("res", "1920"); // 1920x1920
    formData.append("size", "1500"); // 1.5MB

    try {
        const response: PutImage = await $fetch("/api/image", {
            method: "PUT",
            headers: {
                Authorization: runtime.public.token,
            },
            body: formData,
        });
        if (!response.result) {
            throw new Error();
        }
        return response.path;
    } catch (error) {
        console.error("Failed to upload image:", error);
        return null;
    }
};

export interface PutImage {
    path: string;
    result: unknown;
}

export const useDeleteImage = (path: string) => {
    const runtimeConfig = useRuntimeConfig();
    return $fetch(`/api/image?path=${encodeURIComponent(path)}`, {
        method: "DELETE",
        headers: {
            Authorization: runtimeConfig.public.token,
        },
    });
};
