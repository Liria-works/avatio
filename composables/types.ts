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
    created_at: string;
    bio: string;
    links: string[];
    badges: Badges;
    setups: Setup[];
}

export interface Shop {
    id: string;
    name: string;
    thumbnail: string;
    verified: boolean;
}

export interface Item {
    id: number;
    updated_at: string;
    category: number;
    name: string;
    thumbnail: string;
    price: string | null;
    shop: Shop;
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
    name: string;
    description: string | null;
    tags: { tag: string }[];
    author: Author;
    images: { name: string; width: number; height: number }[];
    items: {
        data: Item;
        note: string;
        unsupported: boolean;
    }[];
}

export interface SetupSimple {
    id: number;
    created_at: string;
    name: string;
    author: Author;
    images: { name: string; width: number; height: number }[];
    avatars: {
        name: string;
        thumbnail: string;
        nsfw: boolean;
        outdated: boolean;
    }[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: { data: any }[];
}

export interface CategoryAttr {
    label: string;
    icon: string;
    items: SetupItem[];
}

export interface CategorizedSetupItems {
    avatar: CategoryAttr;
    cloth: CategoryAttr;
    accessory: CategoryAttr;
    other: CategoryAttr;
}
