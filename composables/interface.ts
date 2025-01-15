import { loadDefaultJapaneseParser } from 'budoux';
import { parseURL } from 'ufo';

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

const linkIcons: { [key: string]: string } = {
    'x.com': 'simple-icons:x',
    'youtube.com': 'simple-icons:youtube',
    'twitch.tv': 'simple-icons:twitch',
    'discordapp.com': 'simple-icons:discord',
    'discord.com': 'simple-icons:discord',
    'instagram.com': 'simple-icons:instagram',
    'github.com': 'simple-icons:github',
    'steamcommunity.com': 'simple-icons:steam',
    'pixiv.net': 'simple-icons:pixiv',
    'artstation.com': 'simple-icons:artstation',
    'booth.pm': 'avatio:booth',
};

export const getLinkIcon = (url: string) => {
    const parsed = parseURL(url);
    if (!parsed.host) return 'lucide:link';

    const host = parsed.host.split('.').slice(-2).join('.').replace('www.', '');

    if (Object.keys(linkIcons).includes(host)) return linkIcons[host];
    else return 'lucide:link';
};

export const ERROR_MESSAGES = {
    EMPTY_URL: 'URLを入力してください。',
    INVALID_URL: '無効なURLです。',
    ADD_ITEM_FAILED: 'エラーによりアイテムの追加に失敗しました。',
    MULTIPLE_AVATAR: 'ベースアバターを複数登録することはできません。',
    MULTIPLE_ITEM: 'アイテムは重複して追加できません。',
    ITEM_IN_AVATAR: 'アイテムはベースアバターとして登録されています。',
    SAME_AVATAR: '同じベースアバターが既に登録されています。',
    PUBLISH_FAILED: 'セットアップの公開に失敗しました。',
    UPDATE_FAILED: 'セットアップの更新に失敗しました。',
    NO_AVATAR: 'ベースアバターが登録されていません。',
    NO_ITEMS: 'アイテムが登録されていません。',
    NO_TITLE: 'セットアップ名が入力されていません。',
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
