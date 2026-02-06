import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Conversation, Message } from '../types';

export const useConversations = (organizationId: string) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!organizationId) return;

        const fetchConversations = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('comm_conversations')
                    .select('*')
                    .eq('organization_id', organizationId)
                    .order('last_message_time', { ascending: false });

                if (error) throw error;

                // Transform database rows to App Types
                const mappedConversations: Conversation[] = data.map(row => ({
                    id: row.id,
                    organizationId: row.organization_id || '',
                    contactId: row.contact_id || '',
                    lastMessage: row.last_message || '',
                    lastMessageTime: row.last_message_time || '', // Format might need adjustment
                    unreadCount: row.unread_count || 0,
                    priority: (row.priority as 'low' | 'medium' | 'high' | 'urgent') || 'medium',
                    status: (row.status as 'open' | 'resolved' | 'snoozed') || 'open',
                    tags: row.tags || [],
                    platform: (row.platform as 'whatsapp' | 'instagram' | 'messenger') || 'whatsapp',
                    messages: (row.messages as unknown as Message[]) || [],
                    slaDeadline: row.sla_deadline || undefined,
                    assignedTo: row.assigned_to || undefined
                }));

                setConversations(mappedConversations);
            } catch (err: any) {
                console.error('Error fetching conversations:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();

        // Subscribe to realtime changes
        const subscription = supabase
            .channel('comm_conversations_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'comm_conversations',
                    filter: `organization_id=eq.${organizationId}`
                },
                (payload) => {
                    fetchConversations();
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };

    }, [organizationId]);

    return { conversations, setConversations, loading, error };
};
