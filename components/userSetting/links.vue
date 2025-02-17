<script lang="ts" setup>
import { VueDraggable } from 'vue-draggable-plus';

const links = defineModel<string[]>({ default: [] });

const linkInput = ref<string>('');

const addLink = async () => {
    if (linkInput.value === '') return;

    if (links.value.includes(linkInput.value))
        return useToast().add('リンクが重複しています');

    if (links.value.length >= 8)
        return useToast().add('リンクは最大 8 つまでです');

    try {
        new URL(linkInput.value);
    } catch {
        return useToast().add('URL が不正です');
    }

    links.value.push(linkInput.value);
    linkInput.value = '';
};

const removeLink = async (link: string) => {
    links.value = links.value.filter((i) => i !== link);
};

const pasteFromClipboard = async () =>
    (linkInput.value = await navigator.clipboard.readText());
</script>

<template>
    <UiCard
        :divider="false"
        class="pb-4"
        header-class="flex gap-4 items-center justify-between"
    >
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
                    <Button
                        v-if="!linkInput"
                        variant="flat"
                        icon="lucide:clipboard"
                        class="p-1"
                        @click="pasteFromClipboard"
                    />
                    <Button
                        v-if="linkInput !== ''"
                        variant="flat"
                        icon="lucide:x"
                        class="p-1"
                        @click="linkInput = ''"
                    />
                </template>
            </UiTextinput>
            <Button
                label="追加"
                size="sm"
                class="pr-3 h-[40px]"
                @click="addLink"
            />
        </div>

        <VueDraggable
            v-model="links"
            :animation="150"
            class="empty:hidden w-full mt-2 rounded-xl flex flex-col ring-1 ring-zinc-300 dark:ring-zinc-600 divide-y divide-zinc-300 dark:divide-zinc-600"
        >
            <div
                v-for="i in links"
                :key="useId()"
                class="p-3.5 flex items-center gap-3 cursor-move"
            >
                <Icon
                    name="lucide:grip-vertical"
                    size="18"
                    class="shrink-0 text-zinc-500 dark:text-zinc-400 cursor-move"
                />
                <Icon
                    :name="getLinkInfo(i).icon"
                    size="18"
                    class="shrink-0 text-zinc-500 dark:text-zinc-300"
                />
                <span
                    class="grow text-sm break-all line-clamp-1 text-zinc-700 dark:text-zinc-300"
                >
                    {{ i }}
                </span>
                <Button
                    icon="lucide:x"
                    variant="flat"
                    class="p-1"
                    @click="removeLink(i)"
                />
            </div>
        </VueDraggable>
    </UiCard>
</template>
