<template>
    <ToastProvider>
        <UiToast
            v-for="toast in toasts"
            :key="toast.id"
            :title="toast.title"
            :description="toast.description"
        />
        <ToastViewport
            class="z-[2147483647] fixed bottom-0 right-0 p-3 flex flex-col gap-2 items-end list-none"
        />
    </ToastProvider>
</template>
