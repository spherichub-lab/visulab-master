import { supabase } from '../../lib/supabaseClient';
import { getCompanyBranding } from '../utils/companyBranding';

export interface CreateShortageParams {
    refractive_index: string;
    lens_type: string;
    coating: string;
    sphere: string;
    cylinder: string;
    quantity: number;
}

export interface Shortage {
    id: string;
    refractive_index: string;
    lens_type: string;
    coating: string;
    sphere: string;
    cylinder: string;
    quantity: number;
    user_name?: string;
    company_name?: string;
    company_initials?: string;
    company_color_class?: string;
    created_at: string;
}

export const shortageService = {
    // Fetch all shortages
    getAllShortages: async (): Promise<Shortage[]> => {
        // Simplified query: Fetch ONLY shortages table first
        const { data, error } = await supabase
            .from('shortages')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching shortages:', error);
            throw new Error('Failed to fetch shortages');
        }

        // Transform data
        return (data || []).map((shortage: any) => {
            // Placeholder since we removed the join
            const userName = 'Usuário';
            const companyName = 'Empresa';
            const branding = getCompanyBranding(companyName);

            return {
                id: shortage.id,
                refractive_index: shortage.refractive_index,
                lens_type: shortage.lens_type,
                coating: shortage.coating,
                sphere: shortage.sphere,
                cylinder: shortage.cylinder,
                quantity: shortage.quantity,
                user_name: userName,
                company_name: companyName,
                company_initials: branding.initials,
                company_color_class: branding.colorClass,
                created_at: shortage.created_at
            };
        });
    },

    // Create a new shortage
    createShortage: async (params: CreateShortageParams) => {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('User not authenticated');
        }

        const { data, error } = await supabase
            .from('shortages')
            .insert({
                user_id: user.id,
                refractive_index: params.refractive_index,
                lens_type: params.lens_type,
                coating: params.coating,
                sphere: params.sphere,
                cylinder: params.cylinder,
                quantity: params.quantity
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating shortage:', error);
            throw new Error(`Failed to create shortage: ${error.message}`);
        }

        return data;
    },

    // Get shortage statistics
    getStatistics: async () => {
        const { data, error } = await supabase
            .from('shortages')
            .select('*');

        if (error) {
            console.error('Error fetching statistics:', error);
            throw new Error('Failed to fetch statistics');
        }

        const shortages = data || [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalShortages = shortages.length;
        const todayShortages = shortages.filter(s => {
            const createdDate = new Date(s.created_at);
            createdDate.setHours(0, 0, 0, 0);
            return createdDate.getTime() === today.getTime();
        }).length;

        // Count by refractive_index
        const indexCounts: Record<string, number> = {};
        shortages.forEach(s => {
            if (s.refractive_index) {
                indexCounts[s.refractive_index] = (indexCounts[s.refractive_index] || 0) + s.quantity;
            }
        });

        // Count by coating
        const coatingCounts: Record<string, number> = {};
        shortages.forEach(s => {
            if (s.coating) {
                coatingCounts[s.coating] = (coatingCounts[s.coating] || 0) + s.quantity;
            }
        });

        // Find most common shortage
        const mostCommonIndex = Object.entries(indexCounts).sort((a, b) => b[1] - a[1])[0];
        const mostCommonCoating = Object.entries(coatingCounts).sort((a, b) => b[1] - a[1])[0];

        return {
            totalShortages,
            todayShortages,
            indexCounts,
            coatingCounts,
            mostCommon: mostCommonIndex && mostCommonCoating ? {
                index: mostCommonIndex[0],
                coating: mostCommonCoating[0],
                quantity: mostCommonIndex[1]
            } : null
        };
    }
};
