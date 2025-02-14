<script lang="ts" setup>
const model = defineModel<{ id: string; note: string }[]>({
    default: [],
});

const input = ref('');
const coauthors = ref<
    { id: string; name: string; avatar: string; note: string }[]
>([]);

const user = useSupabaseUser();
const client = useSupabaseClient();

const add = async (id: string) => {
    if (id.length) {
        if (id === user.value?.id)
            return useToast().add(
                '自身を共同作者として追加することはできません'
            );

        const { data } = await client
            .from('users')
            .select('id, name, avatar')
            .eq('id', id)
            .maybeSingle();
        if (!data) return useToast().add('ユーザーが見つかりませんでした');

        coauthors.value.push({
            id: id,
            name: data.name,
            avatar: useGetImage(data.avatar, { prefix: 'avatar' }),
            note: '',
        });
        input.value = '';
    }
};

const remove = (index: number) => {
    coauthors.value.splice(index, 1);
};

watch(coauthors, () => {
    model.value = coauthors.value.map((i) => ({
        id: i.id,
        note: i.note,
    }));
});
</script>

<template>
    <div class="w-full flex flex-col gap-2">
        <UiTextinput
            v-model="input"
            placeholder="ユーザーを追加"
            @keyup.enter="add(input.trim())"
        />
        <EditCoAuthorItem
            v-for="(i, index) in coauthors"
            :key="`coauthor-${index}`"
            :id="i.id"
            :name="i.name"
            :avatar="i.avatar"
            v-model:note="i.note"
            @remove="remove(index)"
        />
    </div>
</template>
