import { toast } from "./store";

export const addToast = ({
	title,
	description,
	duration,
}: { title?: string; description: string; duration?: number }) => {
	const list = toast.get();
	list.push({ title: title, description: description, duration: duration });
	toast.set(list);

	console.log(toast.get());
};
