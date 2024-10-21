<script setup lang="ts">
const user = useSupabaseUser();
const client = await useSBClient();

type Setup = {
    id: number;
    created_at: string;
    updated_at: string;
    name: string;
    avatar: { name: string; thumbnail: string };
    author: { id: string; name: string; avatar: string };
    image: string;
};

const setups = ref<Setup[]>([]);

let query = client
    .from('setups')
    .select(
        'id, created_at, updated_at, author(id, name, avatar), name, image, avatar(name, thumbnail)'
    );
if (user.value) query = query.neq('author', user.value.id);
query = query.range(0, 20).order('created_at', { ascending: false });

const { data } = await query;

if (data) setups.value = data as unknown as Setup[];
</script>

<template>
    <div class="flex flex-col items-start gap-4 w-full">
        <div class="w-full flex gap-4 items-start justify-between">
            <UiTitle label="みんなのセットアップ" icon="lucide:sparkles" />
            <!-- <UiButton
                icon="lucide:rotate-ccw"
                ui="outline-0 p-2 hover:bg-neutral-300 hover:dark:bg-neutral-700"
                @click="get"
            /> -->
        </div>
        <MasonryWall
            v-if="setups"
            :items="setups"
            :column-width="200"
            :gap="20"
            :min-columns="2"
            :max-columns="3"
        >
            <template #default="{ item }">
                <NuxtLink :to="`/setup/${item.id}`">
                    <ItemSetup
                        :name="item.name"
                        :avatar-name="item.avatar.name"
                        :avatar-thumbnail="item.avatar.thumbnail"
                        :author-id="item.author.id"
                        :author-name="item.author.name"
                        :author-avatar="item.author.avatar"
                        :created-at="item.created_at"
                        :image="item.image"
                        :image-size="{ width: 16, height: 9 }"
                        class="hover:bg-neutral-200 dark:hover:bg-neutral-600"
                    />
                </NuxtLink>
            </template>
        </MasonryWall>

        <div
            v-if="!setups"
            class="w-full my-5 font-medium text-center text-neutral-700 dark:text-neutral-300"
        >
            <p>セットアップが見つかりませんでした😢</p>
        </div>
    </div>
</template>
