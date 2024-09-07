<script lang="ts" setup>
const route = useRoute();
const client = await useSBClient();
const user = useSupabaseUser();

const modal_report = ref(false);

const loading = ref(true);
const faild = ref(false);

const userId = ref<string>(route.params.id.toString());
const username = ref("");
const avatar = ref<string | null>(null);
const bio = ref("");
const links = ref([]);
const created_at = ref("");
const setups = ref();

onMounted(async () => {
    const { data } = await client
        .from("users")
        .select("name, avatar, bio, links, created_at")
        .eq("id", route.params.id)
        .single();

    if (!data) {
        faild.value = true;
        return;
    }
    username.value = data.name;
    bio.value = data.bio;
    links.value = data.links;
    created_at.value = data.created_at;

    if (data.avatar) {
        avatar.value = await client.storage
            .from("images")
            .getPublicUrl(data.avatar).data.publicUrl;
    } else {
        avatar.value = null;
    }

    setups.value = await client
        .from("setups")
        .select("id, name, description, author, avatar, image, created_at")
        .eq("author", route.params.id)
        .range(0, 20);

    loading.value = false;
});
</script>

<template>
    <div v-if="!faild && !loading" class="w-full flex flex-col px-2 gap-10">
        <div class="w-full flex flex-col gap-3">
            <div class="w-full flex items-center justify-between">
                <div class="flex gap-6 items-center">
                    <UAvatar
                        v-if="avatar"
                        :src="avatar"
                        alt="Avatar"
                        size="3xl"
                    />
                    <div
                        v-else
                        class="flex items-center justify-center size-20 rounded-full flex-shrink-0 bg-neutral-200 dark:bg-neutral-500"
                    >
                        <Icon
                            name="lucide:user-round"
                            size="36"
                            class="text-neutral-600 dark:text-neutral-300"
                        />
                    </div>
                    <div class="flex flex-col gap-1">
                        <div class="flex gap-3 items-center">
                            <p class="text-2xl font-bold">
                                {{ username }}
                            </p>
                            <UserBadge :user="userId" />
                        </div>
                        <p class="text-sm text-neutral-500">
                            アカウント作成日 :
                            {{
                                new Date(created_at).toLocaleString("ja-JP", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                })
                            }}
                        </p>
                    </div>
                </div>
                <NuxtLink v-if="user && user.id === userId" to="/user/setting">
                    <AButton
                        icon="lucide:pen-line"
                        :icon-size="19"
                        tooltip="プロフィールを編集"
                    />
                </NuxtLink>
                <AButton
                    v-else
                    icon="lucide:flag"
                    :icon-size="19"
                    tooltip="ユーザーを報告"
                    @click="modal_report = true"
                />
                <UModal
                    v-model="modal_report"
                    :ui="{
                        background: 'bg-white dark:bg-neutral-100',
                        ring: 'ring-0',
                        rounded: 'rounded-xl',
                    }"
                >
                    <ModalReportUser
                        :id="userId"
                        @close="modal_report = false"
                    />
                </UModal>
            </div>

            <div class="w-full flex flex-col gap-3 pl-2">
                <div v-if="links" class="flex items-center gap-2">
                    <NuxtLink v-for="i in links" :to="i" target="_blank">
                        <AButton
                            :text="i"
                            class="text-neutral-500 dark:text-neutral-300"
                        />
                    </NuxtLink>
                </div>

                <div
                    class="w-full bg-neutral-200 dark:bg-neutral-700 rounded-xl px-4 py-3"
                >
                    <p class="text-neutral-500 text-sm mt-[-2px]">bio</p>
                    <p v-if="!bio" class="text-neutral-400">自己紹介が未設定</p>
                    <div v-if="bio">
                        <p
                            v-for="(i, index) in bio.split('\n')"
                            :key="'bio-line-' + index"
                        >
                            {{ i }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="setups" class="w-full flex flex-col gap-5 pl-2">
            <ATitle title="セットアップ" icon="lucide:shirt" />

            <NuxtLink
                v-for="i in setups.data"
                :key="'user-setup-' + i.id"
                :to="{ name: 'setup-id', params: { id: i.id } }"
            >
                <ItemSetupDetail
                    :name="i.name"
                    :description="i.description"
                    :avatar="i.avatar"
                    :author="i.author"
                    :created-at="i.created_at"
                    :image="i.image"
                    class="hover:bg-neutral-200 dark:hover:bg-neutral-700"
                />
            </NuxtLink>
        </div>
    </div>

    <div v-else-if="faild" class="w-full flex flex-col items-center">
        <p class="text-neutral-400 mt-5">ユーザーデータの取得に失敗しました</p>
    </div>
</template>
