export interface ErrorType {
    status: number;
    message: string;
    ja: string;
}

export default () => {
    return {
        general: {
            forbidden: {
                status: 403,
                message: 'Forbidden.',
                ja: 'アクセスが拒否されました。',
            },
        },
        putSetup: {
            itemCheckFailed: {
                status: 1,
                message: 'Internal item check failed.',
                ja: 'アイテムのチェックに失敗しました。',
            },
            noTitle: {
                status: 10,
                message: 'Title is required.',
                ja: 'タイトルを入力してください。',
            },
            noAvatar: {
                status: 11,
                message: 'Avatar is required.',
                ja: 'アバターを登録してください。',
            },
            tooManyAvatars: {
                status: 12,
                message: 'Too many avatars.',
                ja: 'アバターは1個のみ登録可能です。',
            },
            noItems: {
                status: 13,
                message: 'Items are required.',
                ja: 'アイテムを登録してください。',
            },
            tooManyItems: {
                status: 14,
                message: 'Too many items.',
                ja: 'アイテムは最大32個まで登録可能です。',
            },
            uploadImage: {
                status: 20,
                message: 'Failed to upload image.',
                ja: '画像のアップロードに失敗しました。画像の形式が非対応の可能性があります。',
            },
            insertSetup: {
                status: 30,
                message: 'Failed to insert on DB. Table: setups',
                ja: 'データベースへの登録に失敗しました。',
            },
            insertItems: {
                status: 31,
                message: 'Failed to insert on DB. Table: setup_items',
                ja: 'データベースへの登録に失敗しました。',
            },
            insertTags: {
                status: 32,
                message: 'Failed to insert on DB. Table: setup_tags',
                ja: 'データベースへの登録に失敗しました。',
            },
            insertImages: {
                status: 33,
                message: 'Failed to insert on DB. Table: setup_images',
                ja: 'データベースへの登録に失敗しました。',
            },
        },
    };
};
