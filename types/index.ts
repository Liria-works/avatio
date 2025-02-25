export interface Author {
    id: string;
    name: string;
    avatar?: string | null;
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
    setups: SetupClient[];
}

export interface Shop {
    id: string;
    name: string;
    thumbnail: string | null;
    verified: boolean;
}

export type ItemCategory =
    | 'avatar'
    | 'cloth'
    | 'accessory'
    | 'other'
    | 'hair'
    | 'shader'
    | 'texture'
    | 'tool';

export interface Item {
    id: number;
    updated_at: string;
    category: ItemCategory;
    name: string;
    thumbnail: string;
    price: string | null;
    likes: number | null;
    shop: Shop;
    nsfw: boolean;
    outdated: boolean;
    source: string | null;
}

export interface SetupItem extends Item {
    note: string;
    unsupported: boolean;
}

export interface SetupImages {
    name: string;
    width?: number | null;
    height?: number | null;
}

export interface SetupBase {
    id: number;
    created_at: string;
    name: string;
    description: string | null;
    author: Author;
    images: SetupImages[];
    unity: string | null;
}

export interface SetupDB extends SetupBase {
    tags: { tag: string }[];
    co_authors: {
        user: { id: string; name: string; avatar: string };
        note: string;
    }[];
    items: {
        data: Item;
        note: string;
        unsupported: boolean;
        category: ItemCategory;
    }[];
}

export interface SetupClient extends SetupBase {
    tags: string[];
    co_authors: (Author & { note: string })[];
    items: Record<string, SetupItem[]>;
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

export interface DocumentData {
    slug: string;
    created_at: string;
    updated_at: string;
    title: string;
    description?: string;
    thumbnail?: string | null;
    content: string;
    published: boolean;
}

export interface HeaderBadge {
    label: string;
    link: string;
}

export interface ApiResponse<Data> {
    error: ErrorType | null;
    data: Data | null;
}
