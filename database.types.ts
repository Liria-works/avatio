export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	public: {
		Tables: {
			avatar_details: {
				Row: {
					created_at: string;
					id: number;
					short_en: string | null;
					short_ja: string | null;
					short_kr: string | null;
					vrc_sample: string | null;
					vrc_world: string | null;
				};
				Insert: {
					created_at?: string;
					id?: number;
					short_en?: string | null;
					short_ja?: string | null;
					short_kr?: string | null;
					vrc_sample?: string | null;
					vrc_world?: string | null;
				};
				Update: {
					created_at?: string;
					id?: number;
					short_en?: string | null;
					short_ja?: string | null;
					short_kr?: string | null;
					vrc_sample?: string | null;
					vrc_world?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "avatar_details_id_fkey";
						columns: ["id"];
						isOneToOne: true;
						referencedRelation: "items";
						referencedColumns: ["id"];
					},
				];
			};
			badges: {
				Row: {
					alpha_tester: boolean;
					contributor: boolean;
					created_at: string;
					developer: boolean;
					shop_owner: boolean;
					translator: boolean;
					updated_at: string;
					user_id: string;
				};
				Insert: {
					alpha_tester?: boolean;
					contributor?: boolean;
					created_at?: string;
					developer?: boolean;
					shop_owner?: boolean;
					translator?: boolean;
					updated_at?: string;
					user_id: string;
				};
				Update: {
					alpha_tester?: boolean;
					contributor?: boolean;
					created_at?: string;
					developer?: boolean;
					shop_owner?: boolean;
					translator?: boolean;
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "badges_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: true;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
				];
			};
			bookmarks: {
				Row: {
					created_at: string;
					id: number;
					post: number;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					id?: number;
					post: number;
					user_id?: string;
				};
				Update: {
					created_at?: string;
					id?: number;
					post?: number;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "bookmarks_post_fkey";
						columns: ["post"];
						isOneToOne: false;
						referencedRelation: "setups";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "bookmarks_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
				];
			};
			items: {
				Row: {
					category: number;
					created_at: string;
					id: number;
					name: string;
					nsfw: boolean;
					outdated: boolean;
					price: string | null;
					shop_id: string;
					thumbnail: string;
					updated_at: string;
				};
				Insert: {
					category: number;
					created_at?: string;
					id: number;
					name: string;
					nsfw: boolean;
					outdated?: boolean;
					price?: string | null;
					shop_id?: string;
					thumbnail: string;
					updated_at?: string;
				};
				Update: {
					category?: number;
					created_at?: string;
					id?: number;
					name?: string;
					nsfw?: boolean;
					outdated?: boolean;
					price?: string | null;
					shop_id?: string;
					thumbnail?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "items_shop_id_fkey";
						columns: ["shop_id"];
						isOneToOne: false;
						referencedRelation: "shops";
						referencedColumns: ["id"];
					},
				];
			};
			setup_items: {
				Row: {
					id: number;
					item_id: number | null;
					note: string | null;
					setup_id: number;
					unsupported: boolean;
				};
				Insert: {
					id?: number;
					item_id?: number | null;
					note?: string | null;
					setup_id: number;
					unsupported?: boolean;
				};
				Update: {
					id?: number;
					item_id?: number | null;
					note?: string | null;
					setup_id?: number;
					unsupported?: boolean;
				};
				Relationships: [
					{
						foreignKeyName: "setup_items_item_id_fkey";
						columns: ["item_id"];
						isOneToOne: false;
						referencedRelation: "items";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "setup_items_setup_id_fkey";
						columns: ["setup_id"];
						isOneToOne: false;
						referencedRelation: "setups";
						referencedColumns: ["id"];
					},
				];
			};
			setups: {
				Row: {
					author: string;
					avatar: number | null;
					avatar_note: string | null;
					created_at: string;
					description: string | null;
					id: number;
					image: string | null;
					name: string;
					tags: string[] | null;
					updated_at: string;
				};
				Insert: {
					author?: string;
					avatar?: number | null;
					avatar_note?: string | null;
					created_at?: string;
					description?: string | null;
					id?: number;
					image?: string | null;
					name: string;
					tags?: string[] | null;
					updated_at?: string;
				};
				Update: {
					author?: string;
					avatar?: number | null;
					avatar_note?: string | null;
					created_at?: string;
					description?: string | null;
					id?: number;
					image?: string | null;
					name?: string;
					tags?: string[] | null;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "setups_author_fkey";
						columns: ["author"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "setups_avatar_fkey";
						columns: ["avatar"];
						isOneToOne: false;
						referencedRelation: "items";
						referencedColumns: ["id"];
					},
				];
			};
			shops: {
				Row: {
					created_at: string;
					id: string;
					name: string;
					thumbnail: string | null;
					updated_at: string;
					verified: boolean;
				};
				Insert: {
					created_at?: string;
					id: string;
					name: string;
					thumbnail?: string | null;
					updated_at?: string;
					verified: boolean;
				};
				Update: {
					created_at?: string;
					id?: string;
					name?: string;
					thumbnail?: string | null;
					updated_at?: string;
					verified?: boolean;
				};
				Relationships: [];
			};
			users: {
				Row: {
					avatar: string | null;
					bio: string | null;
					created_at: string;
					id: string;
					links: string[];
					name: string | null;
				};
				Insert: {
					avatar?: string | null;
					bio?: string | null;
					created_at?: string;
					id: string;
					links?: string[];
					name?: string | null;
				};
				Update: {
					avatar?: string | null;
					bio?: string | null;
					created_at?: string;
					id?: string;
					links?: string[];
					name?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "users_id_fkey";
						columns: ["id"];
						isOneToOne: true;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			avatars_order_by_count: {
				Args: Record<PropertyKey, never>;
				Returns: Json;
			};
			search_items: {
				Args: {
					keywords: string;
				};
				Returns: {
					id: number;
					name: string;
					shop_id: string;
					shop: string;
					shop_thumbnail: string;
					category: number;
					price: string;
					thumbnail: string;
					score: number;
				}[];
			};
			search_setups: {
				Args: {
					keywords: string;
				};
				Returns: {
					id: number;
					name: string;
					author: string;
					avatar: number;
					image: string;
					score: number;
				}[];
			};
			search_setups_by_item: {
				Args: {
					query_id: number;
				};
				Returns: {
					id: number;
					name: string;
					description: string;
					author: string;
					avatar: number;
					image: string;
					created_at: string;
				}[];
			};
			search_setups_by_tags: {
				Args: {
					query_tags: string[];
				};
				Returns: {
					id: number;
					name: string;
					description: string;
					author: string;
					avatar: number;
					image: string;
					created_at: string;
				}[];
			};
			tags_order_by_count: {
				Args: Record<PropertyKey, never>;
				Returns: Json;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (PublicSchema["Tables"] & PublicSchema["Views"])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
				Database[PublicTableNameOrOptions["schema"]]["Views"])
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
			Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
				PublicSchema["Views"])
		? (PublicSchema["Tables"] &
				PublicSchema["Views"])[PublicTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	PublicTableNameOrOptions extends
		| keyof PublicSchema["Tables"]
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
		? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends
		| keyof PublicSchema["Tables"]
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
		? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	PublicEnumNameOrOptions extends
		| keyof PublicSchema["Enums"]
		| { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
		: never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
		? PublicSchema["Enums"][PublicEnumNameOrOptions]
		: never;
