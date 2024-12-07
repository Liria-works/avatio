export interface Author {
    id: string;
    name: string;
    avatar: string;
}

export interface Badges {
    developer: boolean;
    contributor: boolean;
    translator: boolean;
    alpha_tester: boolean;
    shop_owner: boolean;
}

export interface User extends Author {
    bio: string;
    links: string[];
    created_at: string;
    setups: Setup[];
    badges: Badges;
}

export interface Item {
    id: number;
    updated_at: string;
    category: number;
    name: string;
    thumbnail: string;
    price: string | null;
    shop: { id: string; name: string; thumbnail: string; verified: boolean };
    nsfw: boolean;
    outdated: boolean;
}

export interface SetupItem extends Item {
    note: string;
    unsupported: boolean;
}

export interface Setup {
    id: number;
    created_at: string;
    updated_at: string;
    name: string;
    description: string | null;
    avatar: Item;
    avatar_note: string | null;
    tags: { tag: string }[];
    author: Author;
    image: string;
    items: {
        data: Item;
        note: string;
        unsupported: boolean;
    }[];
}

export interface SetupSimple {
    id: number;
    created_at: string;
    updated_at: string;
    name: string;
    avatar: { name: string; thumbnail: string; outdated: boolean };
    author: Author;
    image: string;
}
