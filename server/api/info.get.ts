import sanitizeHtml from 'sanitize-html';
import { marked } from 'marked';
import { serverSupabaseClient } from '#supabase/server';
import type { ApiResponse, DocumentData } from '~/types';

export default defineEventHandler(
    async (event): Promise<ApiResponse<DocumentData>> => {
        const query = getQuery(event);

        if (!query.slug) return { data: null, error: 'Slug is required.' };
        if (!query.type) return { data: null, error: 'Type is required.' };
        const { type, slug } = query as {
            type: 'info' | 'release';
            slug: string;
        };
        const table = type === 'release' ? 'releases' : type;

        const supabase = await serverSupabaseClient(event);
        const { data, error } = await supabase
            .from(table)
            .select(
                'slug, created_at, updated_at, title, content, thumbnail, published'
            )
            .eq('published', true)
            .eq('slug', slug)
            .maybeSingle<DocumentData>();

        if (error) return { data: null, error: error.message };
        if (!data || !data.slug)
            return { data: null, error: 'Document not found or missing slug.' };

        return {
            data: {
                ...data,
                html: sanitizeHtml(
                    await marked.parse(data.content, { breaks: true })
                ),
            },
            error: null,
        };
    }
);
