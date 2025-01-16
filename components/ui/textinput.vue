<script lang="ts" setup>
const input = defineModel<string>({
    default: '',
});

interface Prop {
    placeholder?: string;
    disabled?: boolean;
    autocomplete?: string;
}
const props = defineProps<Prop>();
</script>

<template>
    <div
        class="w-full p-1 rounded-lg flex items-center border border-zinc-400 dark:border-zinc-500 bg-zinc-100 dark:bg-zinc-900"
    >
        <UInput
            v-model="input"
            :disabled="props.disabled"
            :autocomplete="props.autocomplete"
            variant="none"
            size="sm"
            :placeholder="props.placeholder"
            :ui="{
                rounded: 'rounded-lg',
            }"
            class="grow"
        />

        <slot name="trailing" />
    </div>
</template>
