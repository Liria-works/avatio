<script lang="ts" setup>
import { VueDraggable } from 'vue-draggable-plus';

interface Props {
    initial: string[];
}
const props = defineProps<Props>();
const links = ref<string[]>(props.initial);

const linkInput = ref<string>('');
const linkAdding = ref<boolean>(false);

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

    linkAdding.value = true;
    links.value.push(linkInput.value);

    try {
        await useSaveLink(links.value);
    } catch (e) {
        console.error(e);
        links.value = links.value.filter((i) => i !== linkInput.value);
    }

    linkInput.value = '';
    linkAdding.value = false;
};

const removeLink = async (link: string) => {
    links.value = links.value.filter((i) => i !== link);
    await useSaveLink(links.value);
};

const pasteFromClipboard = async () =>
    (linkInput.value = await navigator.clipboard.readText());
</script>

<template>
    <UiCard :divider="false">
        <template #header>
            <UiTitle label="リンク" icon="lucide:link" is="h2" />
        </template>

        <VueDraggable
            v-model="links"
            :animation="150"
            class="w-full rounded-xl flex flex-col ring-1 ring-zinc-300 dark:ring-zinc-600 divide-y divide-zinc-300 dark:divide-zinc-600"
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
            <div class="flex gap-1 items-center w-full mt-1">
                <div
                    class="w-full px-1 rounded-xl bg-zinc-200 dark:bg-zinc-800 ring-1 ring-zinc-300 dark:ring-zinc-700"
                >
                    <UInput
                        v-model="linkInput"
                        :disabled="linkAdding"
                        autocomplete="off"
                        variant="none"
                        size="sm"
                        placeholder="リンクを入力"
                        class="w-full"
                        :ui="{
                            rounded: 'rounded-xl',
                            icon: { trailing: { pointer: '' } },
                        }"
                        @keyup.enter="addLink"
                    >
                        <template #trailing>
                            <UButton
                                v-show="!linkInput"
                                color="gray"
                                variant="link"
                                icon="lucide:clipboard"
                                :padded="false"
                                @click="pasteFromClipboard"
                            />
                            <UButton
                                v-show="linkInput !== ''"
                                color="gray"
                                variant="link"
                                icon="lucide:x"
                                :padded="false"
                                @click="linkInput = ''"
                            />
                        </template>
                    </UInput>
                </div>
                <UButton
                    :icon="
                        !linkAdding
                            ? 'lucide:plus'
                            : 'i-svg-spinners-ring-resize'
                    "
                    :disabled="linkAdding"
                    label="追加"
                    size="sm"
                    :ui="{
                        rounded: 'rounded-xl',
                    }"
                    class="pr-3 h-[34px]"
                    @click="addLink"
                />
            </div>
        </template>
    </UiCard>
</template>
