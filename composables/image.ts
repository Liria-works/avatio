const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};

export const useGetImage = (name: string, options?: { prefix: string }) => {
    const runtime = useRuntimeConfig();

    const img = name
        .split('/')
        .map((p) => encodeURIComponent(p))
        .join('/');

    return `${runtime.public.r2.domain}${options?.prefix ? `/${options.prefix}` : ''}/${img}`;
};

export const usePutImage = async (
    file: File,
    options: { resolution: number; size: number; prefix?: string }
) => {
    try {
        const response = await $fetch<
            ApiResponse<{
                path: string;
                prefix: string;
                width?: number;
                height?: number;
            }>
        >('/api/image', {
            method: 'PUT',
            body: {
                image: convertFileToBase64(file),
                resolution: options.resolution,
                size: options.size,
                prefix: options.prefix ?? '',
            },
        });
        if (!response.data) throw new Error();
        return {
            name: response.data.path,
            prefix: response.data.prefix,
            width: response.data.width,
            height: response.data.height,
        };
    } catch (error) {
        console.error('Failed to upload image:', error);
        return null;
    }
};

export const useDeleteImage = (name: string, options?: { prefix?: string }) => {
    const path = options?.prefix
        ? `${options.prefix}:${encodeURIComponent(name)}`
        : encodeURIComponent(name);

    return $fetch(`/api/image?path=${path}`, {
        method: 'DELETE',
    });
};
