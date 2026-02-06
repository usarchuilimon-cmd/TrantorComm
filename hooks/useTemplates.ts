import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { WhatsAppTemplate } from '../types';

export const useTemplates = (organizationId: string) => {
    const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!organizationId) {
            setLoading(false);
            return;
        }

        const fetchTemplates = async () => {
            try {
                const { data, error } = await supabase
                    .from('comm_templates')
                    .select('*')
                    .eq('organization_id', organizationId);

                if (error) throw error;

                const mapped: WhatsAppTemplate[] = data.map(t => ({
                    id: t.id,
                    organizationId: t.organization_id,
                    name: t.name,
                    language: t.language,
                    category: t.category,
                    status: t.status,
                    components: t.components
                }));
                setTemplates(mapped);
            } catch (err: any) {
                console.error('Error fetching templates:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTemplates();

        // Real-time updates
        const channel = supabase
            .channel('public:comm_templates')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'comm_templates', filter: `organization_id=eq.${organizationId}` },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        const newTemplate: WhatsAppTemplate = {
                            id: payload.new.id,
                            organizationId: payload.new.organization_id,
                            name: payload.new.name,
                            language: payload.new.language,
                            category: payload.new.category,
                            status: payload.new.status,
                            components: payload.new.components
                        };
                        setTemplates(prev => [newTemplate, ...prev]);
                    } else if (payload.eventType === 'UPDATE') {
                        setTemplates(prev => prev.map(t => t.id === payload.new.id ? {
                            ...t,
                            status: payload.new.status,
                            components: payload.new.components
                        } : t));
                    } else if (payload.eventType === 'DELETE') {
                        setTemplates(prev => prev.filter(t => t.id !== payload.old.id));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };

    }, [organizationId]);

    const syncTemplates = async () => {
        // Logic to trigger a sync with Meta API would go here
        // For now, we simulate a delay as backend logic handles the actual sync
        return new Promise(resolve => setTimeout(resolve, 2000));
    };

    return { templates, loading, syncTemplates };
};
