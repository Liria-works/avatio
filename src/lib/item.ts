export type Item = {
	note: string;
	unsupported: boolean;
	id: number;
	updated_at: string;
	category: number;
	name: string;
	thumbnail: string;
	price: string;
	shop_id: { id: string; name: string; thumbnail: string; verified: boolean };
	nsfw: boolean;
};

export const categoryAttr: { [key: string]: { label: string; icon: string } } =
	{
		cloth: { label: "衣装", icon: "lucide:shirt" },
		accessory: { label: "アクセサリー", icon: "lucide:star" },
		other: { label: "その他", icon: "lucide:package" },
	};
