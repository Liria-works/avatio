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
    return useSeoMeta({
        ogType: type ?? 'article',
        ogUrl: url ?? useBrowserLocation().value.href!,
        title: title,
        titleTemplate: titleTemplate ?? '%s | Avatio',
        ogTitle: title,
        twitterTitle: title,
        description: description,
        ogDescription: description,
        twitterDescription: description,
        ogImage: `https://avatio.me${image ?? '/ogp.png'}`,
        twitterImage: `https://avatio.me${image ?? '/ogp.png'}`,
        ogImageAlt: title,
        twitterImageAlt: title,
        twitterCard: twitterCard ?? 'summary',
        twitterSite: 'liria_work',
    });
};
