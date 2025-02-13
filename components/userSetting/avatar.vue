<script lang="ts" setup>
const image = defineModel<{ oldName: string | null; new: File | null }>({
    default: null,
});
const imagePreview = ref<string | ArrayBuffer | null>(null);

const loading = ref(false);

const { open, onChange } = useFileDialog({
    accept: 'image/png, image/jpeg, image/webp, image/avif, image/tiff',
    multiple: false,
});

onChange((files) => {
    if (files?.length && files[0]) {
        const file = files[0];
        image.value.new = file;

        const reader = new FileReader();
        reader.onload = (e) => {
            if (!e.target) return;
            imagePreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        image.value.new = null;
        imagePreview.value = null;
    }
});
</script>

<template>
    <UiCard :divider="false" content-class="pb-4 flex justify-center">
        <template #header>
            <UiTitle label="アバター" icon="lucide:smile" is="h2" />
        </template>

        <div
            v-if="loading"
            class="flex items-center justify-center size-20 rounded-full shrink-0 bg-zinc-200 dark:bg-zinc-500 relative"
        >
            <Icon
                name="svg-spinners:ring-resize"
                size="36"
                class="text-zinc-600 dark:text-zinc-300"
            />
        </div>

        <div
            v-else-if="imagePreview"
            class="flex items-center justify-center size-20 rounded-full overflow-hidden shrink-0 bg-zinc-200 dark:bg-zinc-500 relative"
        >
            <NuxtImg
                :src="imagePreview.toString()"
                alt="アバター"
                width="80"
                height="80"
                format="webp"
                fit="cover"
                loading="lazy"
                class="shrink-0"
            />
            <button
                type="button"
                class="absolute inset-0 hover:bg-black/20 rounded-full"
                @click="open()"
            />
        </div>

        <div
            v-else-if="image.oldName?.length"
            class="flex items-center justify-center size-20 rounded-full overflow-hidden shrink-0 bg-zinc-200 dark:bg-zinc-500 relative"
        >
            <NuxtImg
                :src="useGetImage(image.oldName, { prefix: 'avatar' })"
                alt="アバター"
                width="80"
                height="80"
                format="webp"
                fit="cover"
                loading="lazy"
                class="shrink-0"
            />
            <button
                type="button"
                class="absolute inset-0 hover:bg-black/20 rounded-full"
                @click="open()"
            />
        </div>

        <div
            v-else
            class="flex items-center justify-center size-20 rounded-full shrink-0 bg-zinc-200 dark:bg-zinc-500 relative"
        >
            <Icon
                name="lucide:user-round"
                size="36"
                class="text-zinc-600 dark:text-zinc-300"
            />
            <button
                type="button"
                class="absolute inset-0 hover:bg-black/20 rounded-full"
                @click="open()"
            />
        </div>
    </UiCard>
</template>
