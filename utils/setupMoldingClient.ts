export default (setup: SetupDB): SetupClient => {
    const items: Pick<SetupClient, 'items'> = {
        items: { avatar: [], cloth: [], accessory: [], other: [] },
    };

    for (const i of setup.items) {
        if (!i.data) continue;

        const item = {
            ...i.data,
            note: i.note,
            unsupported: i.unsupported,
        };

        items.items[item.category].push(item);
    }

    return {
        id: setup.id,
        created_at: setup.created_at,
        name: setup.name,
        description: setup.description,
        author: {
            id: setup.author!.id,
            name: setup.author!.name || 'Unknown',
            avatar: setup.author!.avatar,
        },
        tags: setup.tags.map((t) => t.tag),
        images: setup.images,
        items: items.items,
    };
};
