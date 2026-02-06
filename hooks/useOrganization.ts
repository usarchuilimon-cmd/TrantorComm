import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Organization } from '../types';

export const useOrganization = (organizationId: string) => {
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!organizationId) {
            setLoading(false);
            return;
        }

        const fetchOrg = async () => {
            try {
                const { data, error } = await supabase
                    .from('comm_organizations')
                    .select('*')
                    .eq('id', organizationId)
                    .single();

                if (error) throw error;

                setOrganization({
                    id: data.id,
                    name: data.name,
                    plan: data.plan,
                    status: data.status,
                    settings: data.settings,
                    integrations: data.integrations,
                    createdAt: data.created_at
                });
            } catch (err: any) {
                console.error('Error fetching organization:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrg();

    }, [organizationId]);

    const updateOrganization = async (updates: Partial<Organization>) => {
        if (!organizationId) return;
        try {
            // Map plain object key names back to DB column names if necessary.
            // But here, 'settings' and 'integrations' map 1:1 to JSONB columns.
            const { error } = await supabase
                .from('comm_organizations')
                .update({
                    name: updates.name,
                    settings: updates.settings,
                    integrations: updates.integrations
                })
                .eq('id', organizationId);

            if (error) throw error;

            setOrganization(prev => prev ? { ...prev, ...updates } : null);
            return { success: true };
        } catch (error) {
            console.error('Error updating organization:', error);
            return { success: false, error };
        }
    };

    return { organization, loading, updateOrganization };
};
