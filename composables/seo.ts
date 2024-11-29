export const useSeoHome = async () => {
    const title = 'Avatio';
    const url = 'https://avatio.me';

    return useHead({
        title: title,
        titleTemplate: '%s',
        meta: [
            {
                hid: 'og:url',
                property: 'og:url',
                content: url,
            },
            {
                hid: 'og:title',
                property: 'og:title',
                content: title,
            },
            {
                hid: 'twitter:title',
                property: 'twitter:title',
                content: title,
            },
            {
                hid: 'og:image',
                property: 'og:image',
                content: '/ogp.png',
            },
            {
                hid: 'twitter:image',
                property: 'twitter:image',
                content: '/ogp.png',
            },
            {
                hid: 'icon',
                name: 'icon',
                content: '/favicon.ico',
            },
        ],
    });
};

export const useSeoSetup = async ({
    url,
    title,
    description,
    image,
    userAvatar,
}: {
    url: string;
    title: string;
    description: string | null;
    image?: string;
    userAvatar?: string;
}) => {
    const meta: (
        | { hid: string; property: string; content: string }
        | { hid: string; name: string; content: string }
        | { name: string; content: string }
    )[] = [
        {
            hid: 'og:url',
            property: 'og:url',
            content: url,
        },
        {
            hid: 'og:title',
            property: 'og:title',
            content: title,
        },
        {
            hid: 'twitter:title',
            property: 'twitter:title',
            content: title,
        },
    ];

    if (description) {
        meta.push(
            {
                hid: 'description',
                name: 'description',
                content: description ? description : '',
            },
            {
                hid: 'og:description',
                property: 'og:description',
                content: description ? description : '',
            },
            {
                hid: 'twitter:description',
                property: 'twitter:description',
                content: description ? description : '',
            }
        );
    }

    if (image) {
        meta.push({
            hid: 'og:image',
            property: 'og:image',
            content: await useGetImage(image),
        });
        meta.push({
            hid: 'twitter:image',
            property: 'twitter:image',
            content: await useGetImage(image),
        });
        meta.push({ name: 'twitter:card', content: 'summary_large_image' });
    } else {
        meta.push({
            hid: 'og:image',
            property: 'og:image',
            content: '/ogp.png',
        });
        meta.push({
            hid: 'twitter:image',
            property: 'twitter:image',
            content: '/ogp.png',
        });
        meta.push({ name: 'twitter:card', content: 'summary' });
    }

    if (userAvatar) {
        meta.push({
            hid: 'icon',
            name: 'icon',
            content: await useGetImage(userAvatar),
        });
    }

    return useHead({
        title: title,
        titleTemplate: '%s | Avatio',
        meta: meta,
    });
};

export const useSeoEdit = async () => {
    return useHead({
        title: 'セットアップ作成',
        titleTemplate: '%s | Avatio',
        meta: [
            {
                hid: 'description',
                name: 'description',
                content: '',
            },
            {
                hid: 'og:description',
                property: 'og:description',
                content: '',
            },
            {
                hid: 'twitter:description',
                property: 'twitter:description',
                content: '',
            },
            {
                hid: 'og:image',
                property: 'og:image',
                content: '/ogp.png',
            },
            {
                hid: 'twitter:image',
                property: 'twitter:image',
                content: '/ogp.png',
            },
            { name: 'twitter:card', content: 'summary' },
        ],
    });
};
