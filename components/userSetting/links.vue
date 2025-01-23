<script lang="ts" setup>
import { VueDraggable } from 'vue-draggable-plus';

interface Props {
    initial: string[];
}
const props = defineProps<Props>();
const links = ref<string[]>(props.initial);

const linkInput = ref<string>('');

const addLink = async () => {
    if (linkInput.value === '') return;

    if (links.value.length >= 8)
        return useAddToast('リンクは最大 8 つまでです');

    try {
        new URL(linkInput.value);
    } catch (e) {
        useAddToast('URL が不正です');
        console.error(e);
        return;
    }

    links.value.push(linkInput.value);
};

const removeLink = async (link: string) => {
    links.value = links.value.filter((i) => i !== link);
    await useSaveLink(links.value);
};

const pasteFromClipboard = async () =>
    (linkInput.value = await navigator.clipboard.readText());
</script>

<template>
    <UiCard :divider="false" footer-class="flex gap-4 items-center justify-end">
        <template #header>
            <UiTitle label="リンク" icon="lucide:link" is="h2" />
        </template>

        <div class="flex gap-1 items-center w-full mt-1">
            <UiTextinput
                v-model="linkInput"
                autocomplete="off"
                placeholder="リンクを入力"
                class="grow"
                @keyup.enter="addLink"
            >
                <template #trailing>
                    <ButtonBase
                        v-if="!linkInput"
                        variant="flat"
                        icon="lucide:clipboard"
                        class="p-1"
                        @click="pasteFromClipboard"
                    />
                    <ButtonBase
                        v-if="linkInput !== ''"
                        variant="flat"
                        icon="lucide:x"
                        class="p-1"
                        @click="linkInput = ''"
                    />
                </template>
            </UiTextinput>
            <ButtonBase
                label="追加"
                size="sm"
                class="pr-3 h-[40px]"
                @click="addLink"
            />
        </div>

        <VueDraggable
            v-model="links"
            :animation="150"
            class="w-full mt-2 rounded-xl flex flex-col ring-1 ring-zinc-300 dark:ring-zinc-600 divide-y divide-zinc-300 dark:divide-zinc-600"
        >
            <div
                v-for="i in links"
                :key="useId()"
                class="p-3.5 flex items-center gap-3 cursor-move"
            >
                <Icon
                    name="lucide:grip-vertical"
                    size="18"
                    class="flex-shrink-0 text-zinc-500 dark:text-zinc-400 cursor-move"
                />
                <Icon
                    :name="getLinkInfo(i).icon"
                    size="18"
                    class="flex-shrink-0 text-zinc-500 dark:text-zinc-300"
                />
                <span
                    class="grow text-sm break-all line-clamp-1 text-zinc-700 dark:text-zinc-300"
                >
                    {{ i }}
                </span>
                <ButtonBase
                    icon="lucide:x"
                    variant="flat"
                    class="p-1"
                    @click="removeLink(i)"
                />
            </div>
        </VueDraggable>

        <template #footer>
            <ButtonBase label="保存" @click="useSaveLink(links)" />
        </template>
    </UiCard>
</template>
