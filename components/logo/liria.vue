<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        :width="props.size"
        :height="props.size"
        :viewBox="props.viewBox"
        :fill="props.color"
        :class="props.addClass"
        :stroke-width="'0'"
    >
        <g transform="matrix(0.576894,0,0,0.576894,-39.3695,-27.0018)">
            <path
                d="M716.083,529.14L518.595,331.652L392.053,458.194L590.612,656.754L321.329,926.037L573.748,926.703L843.697,656.754L843.308,656.365L955.756,543.917L828.531,416.692L716.083,529.14ZM321.329,457.237L435.92,342.646L309.378,216.104L68.244,457.237L389.999,778.992L516.541,652.45L321.329,457.237ZM597.679,181.645L470.454,54.42L343.268,181.606L470.493,308.831L597.679,181.645Z"
            />
        </g>
    </svg>
</template>

<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        size?: number;
        color?: string;
        weight?: number;
        filled?: boolean;
        addClass?: string;
        viewBox?: string;
    }>(),
    {
        size: 20,
        color: "#000000",
        weight: 16,
        filled: false,
        addClass: "",
        viewBox: "0 0 512 512",
    }
);
</script>

<style></style>
