import { useToast } from "../components/shadcn/ui/toast/use-toast";
const { toast } = useToast();

export const addToast = ({
	title,
	description,
}: { title?: string; description: string }) => {
	toast({
		title: title,
		description: description,
	});
};
