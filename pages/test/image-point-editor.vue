<script setup lang="ts">
interface Coord {
    x: number;
    y: number;
}
interface Point extends Coord {
    item?: SetupItem;
    color?: string;
}

const image = ref<string>(
    'https://plus.unsplash.com/premium_photo-1668900728583-000881c08cb9?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
);
const points = ref<Point[]>([
    {
        x: 530,
        y: 1235,
        item: undefined,
    },
    {
        x: 329,
        y: 963,
        item: undefined,
    },
]);
const dragIndex = ref<number>(-1);
const containerRef = ref<HTMLDivElement | null>(null);
const imageRef = ref<HTMLImageElement | null>(null);
const selectedPointIndex = ref(-1);
const isColorPickerOpen = ref(false);

const { isOutside } = useMouseInElement(imageRef);

// 座標を画像範囲内に制限する関数
const constrainPoint = (x: number, y: number, rect: DOMRect): Coord => {
    const img = imageRef.value;
    if (!img) return { x, y };

    // 表示サイズと実際のサイズの比率を計算
    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;

    // 座標を0以上、画像サイズ以下に制限
    const constrainedX = Math.max(0, Math.min(x, rect.width));
    const constrainedY = Math.max(0, Math.min(y, rect.height));

    // 実際の画像サイズでの座標を計算
    return {
        x: Math.round(constrainedX * scaleX),
        y: Math.round(constrainedY * scaleY),
    };
};

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

const handleImageClick = (e: MouseEvent) => {
    if (dragIndex.value !== -1) return;
    const target = e.target as HTMLImageElement;
    const rect = target.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newPoint = {
        ...constrainPoint(x, y, rect),
        item: undefined,
    };

    points.value.push(newPoint);
    selectedPointIndex.value = points.value.length - 1;
    isColorPickerOpen.value = true;
};

const startDrag = (index: number) => {
    dragIndex.value = index;
};

const onDrag = (e: MouseEvent) => {
    if (dragIndex.value === -1 || !containerRef.value || !imageRef.value)
        return;

    const rect = imageRef.value.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const item = points.value[dragIndex.value].item;
    const color = points.value[dragIndex.value].color;

    points.value[dragIndex.value] = {
        ...constrainPoint(x, y, rect),
        item,
        color,
    };
};

const endDrag = () => {
    dragIndex.value = -1;
};
</script>

<template>
    <div class="flex flex-col items-center gap-5">
        <UiTextinput v-model="image" placeholder="画像URL" />
        <div
            ref="containerRef"
            class="relative inline-block"
            @mousemove="onDrag"
            @mouseup="endDrag"
            @mouseleave="endDrag"
        >
            <img
                ref="imageRef"
                :src="image"
                :class="[
                    'max-w-96 cursor-pointer select-none',
                    'transition-all duration-100 ease-in-out',
                    isOutside ? '' : 'brightness-75',
                ]"
                @click="handleImageClick"
            />
            <PopupBase v-for="(point, index) in points" :key="useId()">
                <template #trigger>
                    <div
                        :class="[
                            'absolute size-5 -translate-x-2 -translate-y-2 rounded-full',
                            'bg-black dark:bg-white shadow-lg shadow-black border-4 border-zinc-100 dark:border-zinc-900',
                            'cursor-move select-none animate-pulse',
                        ]"
                        :style="{
                            left: `${getDisplayPoint(point).x}px`,
                            top: `${getDisplayPoint(point).y}px`,
                        }"
                        @mousedown.stop="startDrag(index)"
                    />
                </template>
                <template #panel>
                    <div class="p-4">
                        <UiTextinput
                            v-model="points[index].color"
                            placeholder=""
                        />
                    </div>
                </template>
            </PopupBase>
        </div>

        <pre>{{ JSON.stringify(points, null, 2) }}</pre>
    </div>
</template>
