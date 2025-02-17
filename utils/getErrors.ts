export interface ErrorType {
    status: number;
    message: string;
    client: { title: string; description?: string };
}

interface Errors {
    general: {
        forbidden: ErrorType;
    };
    editSetup: {
        emptyUrl: ErrorType;
        invalidUrl: ErrorType;
        addItemFailed: ErrorType;
    };
    publishSetup: {
        itemCheckFailed: ErrorType;
        noTitle: ErrorType;
        noAvatar: ErrorType;
        tooManyAvatars: ErrorType;
        sameAvatars: ErrorType;
        noItems: ErrorType;
        tooManyItems: ErrorType;
        sameItems: ErrorType;
        uploadImage: ErrorType;
        insertSetup: ErrorType;
        insertItems: ErrorType;
        insertTags: ErrorType;
        insertImages: ErrorType;
        tooLongDescription: ErrorType;
        tooManyTags: ErrorType;
        tooLongTitle: ErrorType;
        tooManyCoAuthors: ErrorType;
        insertCoAuthors: ErrorType;
    };
}

export default (): Errors => {
    return {
        general: {
            forbidden: {
                status: 403,
                message: 'Forbidden.',
                client: { title: 'アクセスが拒否されました。' },
            },
        },
        editSetup: {
            emptyUrl: {
                status: 1,
                message: 'URL is empty.',
                client: { title: 'URLを入力してください。' },
            },
            invalidUrl: {
                status: 2,
                message: 'Invalid URL.',
                client: { title: '無効なURLです。' },
            },
            addItemFailed: {
                status: 3,
                message: 'Failed to add item.',
                client: { title: 'アイテムの追加に失敗しました。' },
            },
        },
        publishSetup: {
            itemCheckFailed: {
                status: 1,
                message: 'Internal item check failed.',
                client: { title: 'アイテムのチェックに失敗しました。' },
            },
            noTitle: {
                status: 10,
                message: 'Title is required.',
                client: { title: 'タイトルを入力してください。' },
            },
            noAvatar: {
                status: 11,
                message: 'Avatar is required.',
                client: { title: 'アバターを登録してください。' },
            },
            tooManyAvatars: {
                status: 12,
                message: 'Too many avatars.',
                client: { title: 'アバターは1個のみ登録可能です。' },
            },
            sameAvatars: {
                status: 13,
                message: 'Same avatars.',
                client: {
                    title: '同じアバターを重複して登録することはできません。',
                },
            },
            noItems: {
                status: 14,
                message: 'Items are required.',
                client: { title: 'アイテムを登録してください。' },
            },
            tooManyItems: {
                status: 15,
                message: 'Too many items.',
                client: {
                    title: `アイテムは最大${setupLimits().items}個まで登録可能です。`,
                },
            },
            sameItems: {
                status: 16,
                message: 'Same items.',
                client: {
                    title: '同じアイテムを重複して登録することはできません。',
                },
            },
            uploadImage: {
                status: 20,
                message: 'Failed to upload image.',
                client: {
                    title: '画像のアップロードに失敗しました。',
                    description: '画像の形式が非対応の可能性があります。',
                },
            },
            insertSetup: {
                status: 30,
                message: 'Failed to insert on DB. Table: setups',
                client: { title: 'データベースへの登録に失敗しました。' },
            },
            insertItems: {
                status: 31,
                message: 'Failed to insert on DB. Table: setup_items',
                client: { title: 'データベースへの登録に失敗しました。' },
            },
            insertTags: {
                status: 32,
                message: 'Failed to insert on DB. Table: setup_tags',
                client: { title: 'データベースへの登録に失敗しました。' },
            },
            insertImages: {
                status: 33,
                message: 'Failed to insert on DB. Table: setup_images',
                client: { title: 'データベースへの登録に失敗しました。' },
            },
            tooLongDescription: {
                status: 34,
                message: 'Description is too long.',
                client: {
                    title: `説明文は最大${setupLimits().description}字までです。`,
                },
            },
            tooManyTags: {
                status: 35,
                message: 'Too many tags.',
                client: {
                    title: `タグは最大${setupLimits().tags}個まで登録可能です。`,
                },
            },
            tooLongTitle: {
                status: 36,
                message: 'Title is too long.',
                client: {
                    title: `タイトルは最大${setupLimits().title}字までです。`,
                },
            },
            tooManyCoAuthors: {
                status: 37,
                message: 'Too many co-authors.',
                client: {
                    title: `共同投稿者は最大${setupLimits().coAuthors}人までです。`,
                },
            },
            insertCoAuthors: {
                status: 34,
                message: 'Failed to insert on DB. Table: setup_coauthors',
                client: { title: 'データベースへの登録に失敗しました。' },
            },
        },
    };
};
