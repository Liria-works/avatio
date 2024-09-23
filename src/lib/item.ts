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
