import { loadDefaultJapaneseParser } from "budoux";

export const useSentence = (text: string) => {
    const parser = loadDefaultJapaneseParser();
    return parser.parse(text).join("\u200b");
    // return text.replace(/。/g, "。\u200b");
};

export const useLineBreak = (text: string) => {
    return text.replace(/(\r\n){3,}|\r{3,}|\n{3,}/, "\n\n");
};

export const useWriteClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
};
