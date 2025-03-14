<script lang="ts" setup>
import confetti from 'canvas-confetti';

interface Props {
    id: number | null;
}
const { id } = defineProps<Props>();
const vis = defineModel<boolean>({ default: false });
const emit = defineEmits(['continue']);

const link = computed(() => `https://avatio.me/setup/${id}`);
const setup = ref<SetupClient | null>(null);
const copied = ref(false);

watch(
    () => id,
    async () => {
        if (!id) return;

        const { data } = await $fetch<ApiResponse<SetupClient>>(`/api/setup`, {
            method: 'GET',
            query: { id },
        });

        setup.value = data ?? null;

        confetti({
            particleCount: 80,
            spread: 100,
            origin: { x: 0, y: 0.7 },
        });
        confetti({
            particleCount: 80,
            spread: 100,
            origin: { x: 1, y: 0.7 },
        });
    }
);
</script>

<template>
    <Modal
        v-if="setup"
        v-model="vis"
        @update:open="
            (() => {
                if (!$event) {
                    setup = null;
                    copied = false;
                    emit('continue');
                    vis = false;
                }
            })()
        "
    >
        <template #header>
            <DialogTitle
                class="self-center text-black dark:text-white font-medium"
            >
                投稿が完了しました！
            </DialogTitle>
        </template>

        <div class="flex flex-col items-center gap-1">
            <div
                class="w-full p-3 rounded-lg ring-1 ring-zinc-600 flex flex-col gap-2 items-center"
            >
                <NuxtImg
                    v-if="setup.images.length"
                    :src="
                        setup.images[0]?.name
                            ? useGetImage(setup.images[0].name, {
                                  prefix: 'setup',
                              })
                            : ''
                    "
                    class="max-h-64 rounded-lg"
                />
                <p class="text-sm font-bold text-zinc-300">{{ setup.name }}</p>
            </div>

            <div class="mt-3 flex items-center gap-1">
                <NuxtLink
                    :to="link"
                    target="_blank"
                    class="text-sm text-zinc-400 leading-0"
                >
                    {{ link }}
                </NuxtLink>
                <Button
                    variant="flat"
                    class="ml-2 p-2"
                    @click="
                        useWriteClipboard(link);
                        copied = true;
                    "
                >
                    <Icon v-if="!copied" name="lucide:copy" size="16" />
                    <Icon v-else name="lucide:check" size="16" />
                </Button>
                <PopupShare
                    :setup-name="setup.name"
                    :setup-description="setup.description || ''"
                    :setup-author="setup.author.name"
                    :copy-url-button="false"
                >
                    <Button variant="flat" class="p-2">
                        <Icon name="lucide:share-2" size="16" />
                    </Button>
                </PopupShare>
            </div>

            <Button
                variant="flat"
                class="w-full"
                @click="navigateTo(`/setup/${id}`)"
            >
                <Icon name="lucide:arrow-right" size="18" />
                <span>投稿したセットアップを見る</span>
            </Button>
        </div>

        <template #footer>
            <Button
                @click="
                    setup = null;
                    copied = false;
                    emit('continue');
                    vis = false;
                "
            >
                <Icon name="lucide:plus" size="18" />
                <span>続けて投稿</span>
            </Button>
        </template>
    </Modal>
</template>
