import { supabase } from '../../lib/supabaseClient';
import { getCompanyBranding } from '../utils/companyBranding';

export interface CreatePurchaseParams {
    supplier_id: string;
    date: string;
    items_description: string;
    amount: number;
    status?: 'Pending' | 'Received' | 'Cancelled';
}

export const purchaseService = {
    // Fetch all purchases with supplier information
    getAllPurchases: async () => {
        const { data, error } = await supabase
            .from('purchases')
            .select(`
        *,
        companies:supplier_id (
          id,
          name
        )
      `)
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching purchases:', error);
            throw new Error('Failed to fetch purchases');
        }

        // Transform data to match Purchase interface
        return (data || []).map((purchase: any) => {
            const supplierName = purchase.companies?.name || 'Desconhecido';
            const branding = getCompanyBranding(supplierName);

            return {
                id: purchase.id,
                displayId: purchase.display_id,
                supplier: supplierName,
                supplierInitials: branding.initials,
                supplierColorClass: branding.colorClass,
                date: new Date(purchase.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
                itemsDescription: purchase.items_description || '',
                amount: parseFloat(purchase.amount),
                status: purchase.status
            };
        });
    },

    // Create a new purchase
    createPurchase: async (params: CreatePurchaseParams) => {
        const { data, error } = await supabase
            .from('purchases')
            .insert({
                supplier_id: params.supplier_id,
                date: params.date,
                items_description: params.items_description,
                amount: params.amount,
                status: params.status || 'Pending'
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating purchase:', error);
            throw new Error(`Failed to create purchase: ${error.message}`);
        }

        return data;
    },

    // Update a purchase
    updatePurchase: async (id: string, updates: Partial<CreatePurchaseParams>) => {
        const { data, error } = await supabase
            .from('purchases')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating purchase:', error);
            throw new Error('Failed to update purchase');
        }

        return data;
    },

    // Delete a purchase
    deletePurchase: async (id: string) => {
        const { error } = await supabase
            .from('purchases')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting purchase:', error);
            throw new Error('Failed to delete purchase');
        }
    }
};
