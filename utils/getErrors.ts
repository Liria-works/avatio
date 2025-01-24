export interface ErrorType {
    status: number;
    message: string;
    clientMessage: string;
}

export default () => {
    return {
        general: {
            forbidden: {
                status: 403,
                message: 'Forbidden.',
                clientMessage: 'アクセスが拒否されました。',
            },
        },
        editSetup: {
            emptyUrl: {
                status: 1,
                message: 'URL is empty.',
                clientMessage: 'URLを入力してください。',
            },
            invalidUrl: {
                status: 2,
                message: 'Invalid URL.',
                clientMessage: '無効なURLです。',
            },
            addItemFailed: {
                status: 3,
                message: 'Failed to add item.',
                clientMessage: 'アイテムの追加に失敗しました。',
            },
        },
        publishSetup: {
            itemCheckFailed: {
                status: 1,
                message: 'Internal item check failed.',
                clientMessage: 'アイテムのチェックに失敗しました。',
            },
            noTitle: {
                status: 10,
                message: 'Title is required.',
                clientMessage: 'タイトルを入力してください。',
            },
            noAvatar: {
                status: 11,
                message: 'Avatar is required.',
                clientMessage: 'アバターを登録してください。',
            },
            tooManyAvatars: {
                status: 12,
                message: 'Too many avatars.',
                clientMessage: 'アバターは1個のみ登録可能です。',
            },
            sameAvatars: {
                status: 13,
                message: 'Same avatars.',
                clientMessage:
                    '同じアバターを重複して登録することはできません。',
            },
            noItems: {
                status: 14,
                message: 'Items are required.',
                clientMessage: 'アイテムを登録してください。',
            },
            tooManyItems: {
                status: 15,
                message: 'Too many items.',
                clientMessage: 'アイテムは最大32個まで登録可能です。',
            },
            sameItems: {
                status: 16,
                message: 'Same items.',
                clientMessage:
                    '同じアイテムを重複して登録することはできません。',
            },
            uploadImage: {
                status: 20,
                message: 'Failed to upload image.',
                clientMessage:
                    '画像のアップロードに失敗しました。画像の形式が非対応の可能性があります。',
            },
            insertSetup: {
                status: 30,
                message: 'Failed to insert on DB. Table: setups',
                clientMessage: 'データベースへの登録に失敗しました。',
            },
            insertItems: {
                status: 31,
                message: 'Failed to insert on DB. Table: setup_items',
                clientMessage: 'データベースへの登録に失敗しました。',
            },
            insertTags: {
                status: 32,
                message: 'Failed to insert on DB. Table: setup_tags',
                clientMessage: 'データベースへの登録に失敗しました。',
            },
            insertImages: {
                status: 33,
                message: 'Failed to insert on DB. Table: setup_images',
                clientMessage: 'データベースへの登録に失敗しました。',
            },
        },
    };
};
