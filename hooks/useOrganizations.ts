import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Organization } from '../types';

export const useOrganizations = () => {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const { data, error } = await supabase
                    .from('comm_organizations')
                    .select('*');

                if (error) throw error;

                const mapped: Organization[] = data.map(org => ({
                    id: org.id,
                    name: org.name,
                    plan: org.plan,
                    status: (org.status as string).toUpperCase() as 'ACTIVE' | 'SUSPENDED' | 'TRIAL',
                    settings: org.settings,
                    integrations: org.integrations,
                    createdAt: org.created_at
                }));
                setOrganizations(mapped);
            } catch (err: any) {
                console.error('Error fetching organizations:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrganizations();
    }, []);

    const toggleStatus = async (orgId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
        try {
            const { error } = await supabase
                .from('comm_organizations')
                .update({ status: newStatus })
                .eq('id', orgId);

            if (error) throw error;

            setOrganizations(prev => prev.map(o => o.id === orgId ? { ...o, status: newStatus } : o));
            return { success: true };
        } catch (error) {
            console.error('Error updating org status:', error);
            return { success: false, error };
        }
    };

    return { organizations, loading, toggleStatus };
};
