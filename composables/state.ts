import { defineStore } from "pinia";

export const useBoothItems = defineStore("boothItems", () => {
    const boothItems = ref<{ [key: string]: Item }>({});

    function AddItem(id: number, item: Item) {
        boothItems.value[id] = item;
    }
    return { boothItems, AddItem };
});

export const useSetupIndex = defineStore("setupIndex", () => {
    const user = useSupabaseUser();

    type SetupData = {
        id: number;
        name: string;
        description: string;
        author: { id: string; name: string; avatar: string };
        avatar: { name: string; thumbnail: string };
        image: string;
        created_at: string;
    };
    const setupsIndex = ref<SetupData[]>([]);

    async function GetSetupIndex() {
        const client = await useSBClient();
        if (user.value) {
            const { data } = await client
                .from("setups")
                .select(
                    "id, description, name, author(id, name, avatar), avatar(name, thumbnail), image, created_at"
                )
                .neq("author", user.value.id)
                .order("created_at", { ascending: false })
                .range(0, 20);
            setupsIndex.value = data;
        } else {
            const { data } = await client
                .from("setups")
                .select(
                    "id, description, name, author(id, name, avatar), avatar(name, thumbnail), image, created_at"
                )
                .order("created_at", { ascending: false })
                .range(0, 20);
            setupsIndex.value = data;
        }
    }
    return { setupsIndex, GetSetupIndex };
});

export const useMyAvatar = defineStore("myAvatar", () => {
    const user = useSupabaseUser();

    const myAvatar = ref<string | null>(null);

    async function GetMyAvatar() {
        if (user.value) {
            const client = await useSBClient();
            const { data } = await client
                .from("users")
                .select("avatar")
                .eq("id", user.value.id)
                .single();

            myAvatar.value = await client.storage
                .from("images")
                .getPublicUrl(data.avatar).data.publicUrl;
        }
    }

    return { myAvatar, GetMyAvatar };
});
