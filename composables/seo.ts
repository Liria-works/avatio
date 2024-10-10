export const useSeoSetup = async (
    url: string,
    title: string,
    description: string | null,
    image: string,
    userAvatar?: string
) => {
    const meta: (
        | { hid: string; property: string; content: string }
        | { hid: string; name: string; content: string }
    )[] = [
        {
            hid: "og:url",
            property: "og:url",
            content: url,
        },
        {
            hid: "og:title",
            property: "og:title",
            content: title,
        },
        {
            hid: "og:image",
            property: "og:image",
            content: await useGetImage(image),
        },
        {
            hid: "twitter:title",
            property: "twitter:title",
            content: title,
        },

        {
            hid: "twitter:image",
            property: "twitter:image",
            content: await useGetImage(image),
        },
    ];

    if (description) {
        meta.push(
            {
                hid: "description",
                name: "description",
                content: description ? description : "",
            },
            {
                hid: "og:description",
                property: "og:description",
                content: description ? description : "",
            },
            {
                hid: "twitter:description",
                property: "twitter:description",
                content: description ? description : "",
            }
        );
    }

    if (userAvatar) {
        meta.push({
            hid: "icon",
            name: "icon",
            content: await useGetImage(userAvatar),
        });
    }

    return useHead({
        title: title,
        titleTemplate: "%s | Avatio",
        meta: meta,
    });
};
