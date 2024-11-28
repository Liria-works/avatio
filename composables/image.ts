export const useGetImage = (path: string) => {
    const runtime = useRuntimeConfig();

    const img = path
        .split('/')
        .map((p) => encodeURIComponent(p))
        .join('/');
    return `${runtime.public.r2Domain}/${img}`;
};

export const useUploadAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('res', '512'); // 512x512
    formData.append('size', '300'); // 300KB
    formData.append('path', 'avatar');

    try {
        const response: PutImage = await useAuthFetch('/api/image', {
            method: 'PUT',
            body: formData,
        });
        if (!response.result) throw new Error();
        return response.path;
    } catch (error) {
        console.error('Failed to upload image:', error);
        return null;
    }
};

export const usePostImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('res', '1920'); // 1920x1920
    formData.append('size', '1500'); // 1.5MB

    try {
        const response: PutImage = await useAuthFetch('/api/image', {
            method: 'PUT',
            body: formData,
        });
        if (!response.result) throw new Error();
        return response.path;
    } catch (error) {
        console.error('Failed to upload image:', error);
        return null;
    }
};

export interface PutImage {
    path: string;
    result: unknown;
}

export const useDeleteImage = (path: string) => {
    return useAuthFetch(`/api/image?path=${encodeURIComponent(path)}`, {
        method: 'DELETE',
    });
};
