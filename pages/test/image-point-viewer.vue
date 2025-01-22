<script setup lang="ts">
interface Coord {
    x: number;
    y: number;
}
interface Point extends Coord {
    item?: SetupItem;
}

const image = ref<string>(
    'https://plus.unsplash.com/premium_photo-1668900728583-000881c08cb9?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
);
const points = ref<Point[]>([
    {
        x: 530,
        y: 1235,
        item: {
            id: 2535492,
            updated_at: '2026-01-16 03:54:30.597549+00',
            outdated: false,
            category: 'cloth',
            name: '【3Dモデルウェア】JUCKET_GADGET20',
            thumbnail:
                'https://booth.pximg.net/3923a6a5-7600-4cc2-9240-d92591e77ceb/i/2535492/80921332-44c9-4081-8616-e3fbbebf9599_base_resized.jpg',
            price: '¥ 2,500~',
            shop: {
                id: 'skd-noratama',
                name: 'KUYUYU/電脳屋',
                thumbnail:
                    'https://booth.pximg.net/c/48x48/users/4873611/icon_image/b95d4597-3b78-4c9a-8749-d58ddc3447a3_base_resized.jpg',
                verified: false,
            },
            nsfw: false,
            note: 'this is note',
            unsupported: true,
            source: 'booth',
        },
    },
    {
        x: 329,
        y: 963,
        item: undefined,
    },
]);
const containerRef = ref<HTMLDivElement | null>(null);
const imageRef = ref<HTMLImageElement | null>(null);

// 表示用の座標に変換する関数
const getDisplayPoint = (point: Point): Point => {
    const img = imageRef.value;
    if (!img) return point;

    const rect = img.getBoundingClientRect();
    const scaleX = rect.width / img.naturalWidth;
    const scaleY = rect.height / img.naturalHeight;

    return {
        x: point.x * scaleX,
        y: point.y * scaleY,
    };
};
</script>

<template>
    <div class="flex flex-col items-center gap-5">
        <UiTextinput v-model="image" placeholder="画像URL" />
        <div ref="containerRef" class="relative inline-block">
            <img ref="imageRef" :src="image" class="max-w-96 select-none" />
            <HovercardBase
                v-for="point in points"
                :key="useId()"
                :disabled="!point.item"
                class="p-0 rounded-none border-none"
            >
                <template #trigger>
                    <div
                        class="absolute size-3 -translate-x-2 -translate-y-2 bg-red-500 rounded-full select-none cursor-pointer animate-pulse"
                        :style="{
                            left: `${getDisplayPoint(point).x}px`,
                            top: `${getDisplayPoint(point).y}px`,
                        }"
                    />
                </template>
                <template #content>
                    <SetupsItem v-if="point.item" :item="point.item" />
                </template>
            </HovercardBase>
        </div>
    </div>
</template>
