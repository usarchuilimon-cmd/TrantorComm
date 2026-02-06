import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Contact } from '../types';

export const useContacts = (organizationId: string) => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!organizationId) return;

        const fetchContacts = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('comm_contacts')
                    .select('*')
                    .eq('organization_id', organizationId);

                if (error) throw error;

                // Transform database rows to App Types if necessary (though they matched closely)
                const mappedContacts: Contact[] = data.map(row => ({
                    id: row.id,
                    organizationId: row.organization_id || '',
                    name: row.name,
                    phone: row.phone || '',
                    email: row.email || '',
                    avatar: row.avatar || '',
                    isVip: row.is_vip || false,
                    location: row.location || undefined,
                    tags: row.tags || [],
                    lastSeen: row.last_seen || '', // Date format might vary, kept as string for now
                    company: row.company || undefined,
                    assignedTo: row.assigned_to || undefined,
                    customFields: (row.custom_fields as any) || undefined
                }));

                setContacts(mappedContacts);
            } catch (err: any) {
                console.error('Error fetching contacts:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();

        // Subscribe to realtime changes
        const subscription = supabase
            .channel('comm_contacts_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'comm_contacts',
                    filter: `organization_id=eq.${organizationId}`
                },
                (payload) => {
                    // Simple refresh for MVP
                    fetchContacts();
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };

    }, [organizationId]);

    return { contacts, loading, error };
};
