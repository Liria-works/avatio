import { atom } from "nanostores";

// modal
export const searchOpen = atom(false);
export const addAvatarOpen = atom(false);

// toast
export const toast = atom<
	{ title?: string; description: string; duration?: number }[]
>([]);
