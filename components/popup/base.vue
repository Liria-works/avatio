<script lang="ts" setup>
interface Props {
    side?: 'top' | 'bottom' | 'left' | 'right';
    sideOffset?: number;
}
const props = withDefaults(defineProps<Props>(), {
    side: 'bottom',
    sideOffset: 5,
});
</script>

<template>
    <PopoverRoot>
        <PopoverTrigger as-child>
            <slot name="trigger" />
        </PopoverTrigger>
        <PopoverPortal>
            <PopoverContent
                :side="props.side"
                :side-offset="props.sideOffset"
                as-child
            >
                <div
                    :class="[
                        'rounded-lg p-2 gap-2 flex flex-col bg-zinc-100 dark:bg-zinc-900 shadow-lg shadow-black/50 border border-zinc-400 dark:border-zinc-600',
                        'data-[side=top]:mt-2 data-[side=top]:mx-2',
                        'data-[side=bottom]:mb-2 data-[side=bottom]:mx-2',
                        'data-[side=left]:ml-2 data-[side=left]:my-2',
                        'data-[side=right]:mr-2 data-[side=right]:my-2',
                    ]"
                >
                    <slot name="panel" />
                </div>
                <PopoverArrow class="fill-zinc-400 dark:fill-zinc-600" />
            </PopoverContent>
        </PopoverPortal>
    </PopoverRoot>
</template>
