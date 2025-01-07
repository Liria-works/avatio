export const useGetImage = (name: string, options?: { prefix: string }) => {
    const runtime = useRuntimeConfig();

    const img = name
        .split('/')
        .map((p) => encodeURIComponent(p))
        .join('/');

    return `${runtime.public.r2.domain}${options?.prefix ? `/${options.prefix}` : ''}/${img}`;
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

export const useDeleteImage = (name: string, options?: { prefix?: string }) => {
    const path = options?.prefix
        ? `${options.prefix}:${encodeURIComponent(name)}`
        : encodeURIComponent(name);

    return useAuthFetch(`/api/image?path=${path}`, {
        method: 'DELETE',
    });
};
