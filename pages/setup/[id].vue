<script setup lang="ts">
const route = useRoute();
const id = Number(route.params.id);

if (!id)
    showError({
        statusCode: 404,
        message: 'IDが無効です',
    });

const { data, error } = await $fetch<ApiResponse<SetupClient>>(`/api/setup`, {
    method: 'GET',
    query: { id },
});

if (error && error.status === 404)
    showError({
        statusCode: 404,
        message: 'セットアップが見つかりませんでした',
    });

if (error)
    showError({
        statusCode: 500,
        message: 'セットアップの取得に失敗しました',
    });

useOGP({
    title: `${data!.name} @${data!.author.name}`,
    description: data!.description,
    image: data!.images.length
        ? useGetImage(data!.images[0]!.name, { prefix: 'setup' })
        : 'https://avatio.me/ogp.png',
    twitterCard: data!.images.length ? 'summary_large_image' : 'summary',
});
</script>

<template>
    <div v-if="data" class="flex flex-col gap-8">
        <div class="w-full flex flex-col xl:flex-row items-start gap-8">
            <div class="w-full flex flex-col items-center gap-8">
                <SetupViewerHeader
                    :id="data.id"
                    :title="data.name"
                    :description="data.description"
                    :author="data.author"
                    :created-at="data.created_at"
                    class="w-full"
                />

                <UiImage
                    v-if="data.images.length"
                    :src="
                        useGetImage(data.images[0]!.name, { prefix: 'setup' })
                    "
                    :alt="data.name"
                    :width="data.images[0]!.width ?? 640"
                    :height="data.images[0]!.height ?? 320"
                    class="w-full max-h-[70vh]"
                />

                <SetupViewerAdditionalInfo
                    :description="data.description"
                    :tags="data.tags"
                    :co-authors="data.co_authors"
                    class="w-full flex xl:hidden"
                />

                <SetupViewerItems :items="data.items" class="w-full" />
            </div>

            <SetupViewerAdditionalInfo
                :description="data.description"
                :tags="data.tags"
                :co-authors="data.co_authors"
                class="min-w-[300px] self-stretch hidden xl:flex empty:hidden"
            />
        </div>

        <ButtonSetupReport :id="data.id" />
    </div>
</template>
