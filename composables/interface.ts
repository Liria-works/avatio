import { loadDefaultJapaneseParser } from 'budoux';

export const useAddToast = (title: string, description?: string) => {
    const toast = useToast();
    toast.add({ title: title, description: description, color: 'sky' });
};
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
