<script setup lang="ts">
import { ref, onMounted } from "vue";

import Button from "../../components/button.vue";
import Title from "../../components/title.vue";
import ItemSetup from "../../components/item/setup.vue";

const setups = ref([]);
const loading = ref(true);

onMounted(() => {
    get();
    loading.value = false;
});

const get = async () => {
    const response = await fetch("api/setup/discovery");
    const json = await response.json();

    if (json.body) setups.value = json.body;
};
</script>

<template>
    <div v-show="!loading" class="flex flex-col items-start gap-6 w-full">
        <Title label="みんなのセットアップ" icon="lucide:sparkles" />
        <MasonryWall v-if="setups" :items="setups" :column-width="250" :gap="20" :ssr-columns="3" :min-columns="2"
            :max-columns="4">
            <template #default="{ item }">
                <a :href="`/setup/${item.id}`">
                    <ItemSetup :name="item.name" :avatar_name="item.avatar.name"
                        :avatar_thumbnail="item.avatar.thumbnail" :author_id="item.author.id"
                        :author_name="item.author.name" :author_avatar="item.author.avatar"
                        :created-at="item.created_at" :image="item.image"
                        class="hover:bg-neutral-200 dark:hover:bg-neutral-700" />
                </a>
            </template>
        </MasonryWall>

        <div v-if="!setups" class="w-full my-5 font-medium text-center text-neutral-700 dark:text-neutral-300">
            <p>セットアップが見つかりませんでした😢</p>
        </div>
    </div>
</template>