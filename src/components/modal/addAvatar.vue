<script lang="ts" setup>
import { useStore } from '@nanostores/vue';
import { addAvatarOpen } from '../../lib/modal';
import type { Item } from '../../lib/item';

import ModalBase from './base.vue';
import Button from '../button.vue';

const $addAvatarOpen = useStore(addAvatarOpen);

const props = defineProps<{
    item: Item | null;
}>();

const emit = defineEmits(['addAsAvatar', 'addAsItem', 'cancel']);
</script>

<template>
    <ModalBase title="アバターの追加" icon="lucide:person-standing" :isOpen="$addAvatarOpen"
        @update:isOpen="addAvatarOpen.set($event)">
        <Button label="ベースアバターとして登録" @click="emit('addAsAvatar')" />
        <Button label="アイテムとして登録" @click="emit('addAsItem')" />
    </ModalBase>
</template>
