import { loadDefaultJapaneseParser } from 'budoux';

export const useSentence = (text: string) => {
    const parser = loadDefaultJapaneseParser();
    return parser.parse(text).join('\u200b');
    // return text.replace(/。/g, "。\u200b");
};

export const useLineBreak = (text: string) => {
    return text.replace(/(\r\n){3,}|\r{3,}|\n{3,}/, '\n\n');
};

export const useWriteClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
};

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
        .replace(/ {2}/g, ' ');
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
