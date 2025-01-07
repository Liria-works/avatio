export const useGetImage = (name: string, options?: { prefix: string }) => {
    const runtime = useRuntimeConfig();

    const img = name
        .split('/')
        .map((p) => encodeURIComponent(p))
        .join('/');

    return `${runtime.public.r2.domain}${options?.prefix ? `/${options.prefix}` : ''}/${img}`;
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
        if (!response.success) throw new Error();
        return response.path;
    } catch (error) {
        console.error('Failed to upload image:', error);
        return null;
    }
};

export const usePostImage = async (
    file: File,
    options: { res: number; size: number; prefix?: string }
) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('res', options.res.toString());
    formData.append('size', options.size.toString());
    formData.append('path', options.prefix ?? '');

    try {
        const response: PutImage = await useAuthFetch('/api/image', {
            method: 'PUT',
            body: formData,
        });
        if (!response.success) throw new Error();
        return { name: response.path, prefix: response.prefix };
    } catch (error) {
        console.error('Failed to upload image:', error);
        return null;
    }
};

export interface PutImage {
    path: string;
    prefix: string;
    success: boolean;
}

export const useDeleteImage = (path: string) => {
    return useAuthFetch(`/api/image?path=${encodeURIComponent(path)}`, {
        method: 'DELETE',
    });
};
