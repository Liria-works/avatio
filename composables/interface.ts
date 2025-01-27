import { loadDefaultJapaneseParser } from 'budoux';

export const useAddToast = (title: string, description?: string) => {
    const toast = useToast();
    toast.add({ title: title, description: description, color: 'sky' });
};

export const useSentence = (text: string) =>
    loadDefaultJapaneseParser().parse(text).join('\u200b');

export const useLineBreak = (text: string) =>
    text.replace(/(\r\n){3,}|\r{3,}|\n{3,}/, '\n\n');

export const useLocaledDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
};

export const useWriteClipboard = (text: string) =>
    navigator.clipboard.writeText(text);

export const useAvatarName = (text: string) => {
    return text
        .replace(/オリジナル/g, '')
        .replace(/3Dモデル/g, '')
        .replace(/\//g, ' ')
        .replace(/「/g, ' ')
        .replace(/」/g, ' ')
        .replace(/【/g, ' ')
        .replace(/】/g, ' ')
        .replace(/『/g, ' ')
        .replace(/』/g, ' ')
        .replace(/【/g, ' ')
        .replace(/】/g, ' ')
        .replace(/ {2}/g, ' ')
        .trim();
};

export const useDateElapsed = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
    );
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInMonths / 12);

    if (diffInMinutes < 60) return `${diffInMinutes}分前`;
    if (diffInHours < 24) return `${diffInHours}時間前`;
    if (diffInDays < 30) return `${diffInDays}日前`;
    if (diffInMonths < 12) return `${diffInMonths}ヶ月前`;
    return `${diffInYears}年前`;
};

export const useOGP = ({
    url,
    type,
    title,
    titleTemplate,
    description,
    image,
    twitterCard,
}: {
    url?: string | null;
    type?: 'website' | 'article' | null;
    title: string;
    titleTemplate?: string | null;
    description?: string | null;
    image?: '/ogp.png' | string | null;
    twitterCard?: 'summary' | 'summary_large_image' | null;
}) => {
    const meta: object[] = [
        {
            hid: 'og:url',
            property: 'og:url',
            content: url ?? useBrowserLocation().value.href!,
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
            content: image ?? '/ogp.png',
        },
        {
            hid: 'twitter:image',
            property: 'twitter:image',
            content: image ?? '/ogp.png',
        },
        { name: 'twitter:card', content: twitterCard ?? 'summary' },
        { name: 'twitter:site', content: '@liria_work' },
        { hid: 'og:type', property: 'og:type', content: type ?? 'article' },
    ];

    if (description && description.length) {
        meta.push({
            hid: 'description',
            name: 'description',
            content: description,
        });
        meta.push({
            hid: 'og:description',
            property: 'og:description',
            content: description,
        });
        meta.push({
            hid: 'twitter:description',
            property: 'twitter:description',
            content: description,
        });
    }

    return useHead({
        title: title,
        titleTemplate: titleTemplate ?? '%s | Avatio',
        meta: meta,
    });
};
