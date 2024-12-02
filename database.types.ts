export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export type Database = {
    graphql_public: {
        Tables: {
            [_ in never]: never;
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            graphql: {
                Args: {
                    operationName?: string;
                    query?: string;
                    variables?: Json;
                    extensions?: Json;
                };
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
    public: {
        Tables: {
            articles: {
                Row: {
                    category: string | null;
                    content: string;
                    created_at: string;
                    published: boolean;
                    slug: string;
                    title: string;
                    updated_at: string;
                };
                Insert: {
                    category?: string | null;
                    content: string;
                    created_at?: string;
                    published?: boolean;
                    slug: string;
                    title: string;
                    updated_at?: string;
                };
                Update: {
                    category?: string | null;
                    content?: string;
                    created_at?: string;
                    published?: boolean;
                    slug?: string;
                    title?: string;
                    updated_at?: string;
                };
                Relationships: [];
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
                        foreignKeyName: 'badges_user_id_fkey';
                        columns: ['user_id'];
                        isOneToOne: true;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
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
                        foreignKeyName: 'bookmarks_post_fkey';
                        columns: ['post'];
                        isOneToOne: false;
                        referencedRelation: 'setups';
                        referencedColumns: ['id'];
                    },
                ];
            };
            feedback: {
                Row: {
                    contents: Json;
                    created_at: string;
                    dealt: boolean;
                    id: number;
                    user: string;
                };
                Insert: {
                    contents: Json;
                    created_at?: string;
                    dealt?: boolean;
                    id?: number;
                    user?: string;
                };
                Update: {
                    contents?: Json;
                    created_at?: string;
                    dealt?: boolean;
                    id?: number;
                    user?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'feedback_user_fkey';
                        columns: ['user'];
                        isOneToOne: false;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
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
                        foreignKeyName: 'items_shop_id_fkey';
                        columns: ['shop_id'];
                        isOneToOne: false;
                        referencedRelation: 'shops';
                        referencedColumns: ['id'];
                    },
                ];
            };
            report_setup: {
                Row: {
                    additional: string | null;
                    created_at: string;
                    dealt: boolean;
                    hate: boolean;
                    id: number;
                    infringement: boolean;
                    nsfw_image: boolean;
                    other: boolean;
                    reporter: string;
                    setup_id: number;
                    spam: boolean;
                };
                Insert: {
                    additional?: string | null;
                    created_at?: string;
                    dealt?: boolean;
                    hate?: boolean;
                    id?: number;
                    infringement?: boolean;
                    nsfw_image?: boolean;
                    other?: boolean;
                    reporter?: string;
                    setup_id: number;
                    spam?: boolean;
                };
                Update: {
                    additional?: string | null;
                    created_at?: string;
                    dealt?: boolean;
                    hate?: boolean;
                    id?: number;
                    infringement?: boolean;
                    nsfw_image?: boolean;
                    other?: boolean;
                    reporter?: string;
                    setup_id?: number;
                    spam?: boolean;
                };
                Relationships: [
                    {
                        foreignKeyName: 'report_setup_id_fkey';
                        columns: ['setup_id'];
                        isOneToOne: false;
                        referencedRelation: 'setups';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'report_setup_reporter_fkey';
                        columns: ['reporter'];
                        isOneToOne: false;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                ];
            };
            report_user: {
                Row: {
                    additional: string | null;
                    created_at: string;
                    dealt: boolean;
                    hate: boolean;
                    id: number;
                    infringement: boolean;
                    other: boolean;
                    reportee: string;
                    reporter: string;
                    spam: boolean;
                };
                Insert: {
                    additional?: string | null;
                    created_at?: string;
                    dealt?: boolean;
                    hate?: boolean;
                    id?: number;
                    infringement?: boolean;
                    other?: boolean;
                    reportee: string;
                    reporter?: string;
                    spam?: boolean;
                };
                Update: {
                    additional?: string | null;
                    created_at?: string;
                    dealt?: boolean;
                    hate?: boolean;
                    id?: number;
                    infringement?: boolean;
                    other?: boolean;
                    reportee?: string;
                    reporter?: string;
                    spam?: boolean;
                };
                Relationships: [
                    {
                        foreignKeyName: 'report_user_reportee_fkey';
                        columns: ['reportee'];
                        isOneToOne: false;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'report_user_reporter_fkey';
                        columns: ['reporter'];
                        isOneToOne: false;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'report_user_user_id_fkey';
                        columns: ['reportee'];
                        isOneToOne: false;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
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
                        foreignKeyName: 'setup_items_item_id_fkey';
                        columns: ['item_id'];
                        isOneToOne: false;
                        referencedRelation: 'items';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'setup_items_setup_id_fkey';
                        columns: ['setup_id'];
                        isOneToOne: false;
                        referencedRelation: 'setups';
                        referencedColumns: ['id'];
                    },
                ];
            };
            setup_tags: {
                Row: {
                    id: number;
                    setup_id: number;
                    tag: string;
                };
                Insert: {
                    id?: number;
                    setup_id: number;
                    tag: string;
                };
                Update: {
                    id?: number;
                    setup_id?: number;
                    tag?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'setup_tags_setup_id_fkey';
                        columns: ['setup_id'];
                        isOneToOne: false;
                        referencedRelation: 'setups';
                        referencedColumns: ['id'];
                    },
                ];
            };
            setups: {
                Row: {
                    author: string | null;
                    avatar: number | null;
                    avatar_note: string | null;
                    created_at: string;
                    description: string | null;
                    id: number;
                    image: string | null;
                    name: string;
                    updated_at: string;
                };
                Insert: {
                    author?: string | null;
                    avatar?: number | null;
                    avatar_note?: string | null;
                    created_at?: string;
                    description?: string | null;
                    id?: number;
                    image?: string | null;
                    name: string;
                    updated_at?: string;
                };
                Update: {
                    author?: string | null;
                    avatar?: number | null;
                    avatar_note?: string | null;
                    created_at?: string;
                    description?: string | null;
                    id?: number;
                    image?: string | null;
                    name?: string;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'setups_author_fkey';
                        columns: ['author'];
                        isOneToOne: false;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'setups_avatar_fkey';
                        columns: ['avatar'];
                        isOneToOne: false;
                        referencedRelation: 'items';
                        referencedColumns: ['id'];
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
                    public_id: string;
                };
                Insert: {
                    avatar?: string | null;
                    bio?: string | null;
                    created_at?: string;
                    id: string;
                    links?: string[];
                    name?: string | null;
                    public_id?: string;
                };
                Update: {
                    avatar?: string | null;
                    bio?: string | null;
                    created_at?: string;
                    id?: string;
                    links?: string[];
                    name?: string | null;
                    public_id?: string;
                };
                Relationships: [];
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
            check_password: {
                Args: {
                    user_id: string;
                    plain_password: string;
                };
                Returns: boolean;
            };
            gen_random_key: {
                Args: {
                    bytea_length: number;
                };
                Returns: string;
            };
            get_public_id: {
                Args: {
                    user_id: string;
                };
                Returns: string;
            };
            popular_avatars: {
                Args: Record<PropertyKey, never>;
                Returns: {
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
                }[];
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
                    method: string;
                    query: string[];
                };
                Returns: Database['public']['CompositeTypes']['setup_with_details'][];
            };
            search_tags: {
                Args: {
                    keywords: string;
                    exclude: string[];
                };
                Returns: {
                    tag: string;
                    score: number;
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
            setup_with_details: {
                setup_id: number | null;
                created_at: string | null;
                name: string | null;
                description: string | null;
                updated_at: string | null;
                image: string | null;
                avatar_note: string | null;
                avatar: number | null;
                author: string | null;
                user_id: string | null;
                user_name: string | null;
                item_id: number | null;
                item_name: string | null;
                tag: string | null;
            };
        };
    };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
    PublicTableNameOrOptions extends
        | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
              Database[PublicTableNameOrOptions['schema']]['Views'])
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
          Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
          Row: infer R;
      }
        ? R
        : never
    : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
            PublicSchema['Views'])
      ? (PublicSchema['Tables'] &
            PublicSchema['Views'])[PublicTableNameOrOptions] extends {
            Row: infer R;
        }
          ? R
          : never
      : never;

export type TablesInsert<
    PublicTableNameOrOptions extends
        | keyof PublicSchema['Tables']
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
          Insert: infer I;
      }
        ? I
        : never
    : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
      ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
            Insert: infer I;
        }
          ? I
          : never
      : never;

export type TablesUpdate<
    PublicTableNameOrOptions extends
        | keyof PublicSchema['Tables']
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
          Update: infer U;
      }
        ? U
        : never
    : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
      ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
            Update: infer U;
        }
          ? U
          : never
      : never;

export type Enums<
    PublicEnumNameOrOptions extends
        | keyof PublicSchema['Enums']
        | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
        : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
      ? PublicSchema['Enums'][PublicEnumNameOrOptions]
      : never;

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
        | keyof PublicSchema['CompositeTypes']
        | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
        : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
      ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
      : never;
