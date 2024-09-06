export const useAddToast = (title: string, description?: string) => {
    const toast = useToast();
    toast.add({ title: title, description: description, color: "sky" });
};
