import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Campaign } from '../types';

export const useCampaigns = (organizationId: string) => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!organizationId) {
            setLoading(false);
            return;
        }

        const fetchCampaigns = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('comm_campaigns')
                    .select('*')
                    .eq('organization_id', organizationId)
                    .order('sent_date', { ascending: false });

                if (error) throw error;

                const mappedCampaigns: Campaign[] = data.map(row => ({
                    id: row.id,
                    organizationId: row.organization_id,
                    name: row.name,
                    status: row.status as any,
                    sentDate: new Date(row.sent_date).toLocaleDateString(), // Basic formatting
                    audienceSize: row.audience_size,
                    deliveredCount: row.delivered_count,
                    readCount: row.read_count,
                    templateName: row.template_name,
                    tagFilter: row.tag_filter
                }));

                setCampaigns(mappedCampaigns);
            } catch (err: any) {
                console.error('Error fetching campaigns:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();

        const subscription = supabase
            .channel('comm_campaigns_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'comm_campaigns',
                    filter: `organization_id=eq.${organizationId}`
                },
                (payload) => {
                    fetchCampaigns();
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };

    }, [organizationId]);

    return { campaigns, setCampaigns, loading, error };
};
