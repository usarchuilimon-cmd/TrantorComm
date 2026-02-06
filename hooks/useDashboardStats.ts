import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { User } from '../types';

export interface DashboardStats {
    newMessages: number;
    pending: number;
    activeChats: number;
    avgTime: string;
    volumeData: { name: string; uv: number }[];
    teamMembers: User[];
    alerts: { id: string; title: string; desc: string; type: 'urgent' | 'warning' }[];
}

export const useDashboardStats = (organizationId: string) => {
    const [stats, setStats] = useState<DashboardStats>({
        newMessages: 0,
        pending: 0,
        activeChats: 0,
        avgTime: '0m',
        volumeData: [],
        teamMembers: [],
        alerts: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!organizationId) return;

        const fetchStats = async () => {
            try {
                setLoading(true);

                // 1. Fetch Conversations for Counts
                const { data: conversations, error: convError } = await supabase
                    .from('comm_conversations')
                    .select('*')
                    .eq('organization_id', organizationId);

                if (convError) throw convError;

                // Calculate KPIs
                const newMessages = conversations?.reduce((acc, curr) => acc + (curr.unread_count || 0), 0) || 0;
                const pending = conversations?.filter(c => c.status === 'open' && c.unread_count > 0).length || 0;
                const activeChats = conversations?.filter(c => c.status === 'open').length || 0;

                // 2. Fetch Team Members
                const { data: team, error: teamError } = await supabase
                    .from('comm_users')
                    .select('*')
                    .eq('organization_id', organizationId);

                if (teamError) throw teamError;

                const mappedTeam: User[] = team?.map(u => ({
                    id: u.id,
                    organizationId: u.organization_id,
                    name: u.name,
                    email: u.email,
                    role: u.role as any,
                    avatar: u.avatar,
                    status: u.status as any,
                    preferences: u.preferences,
                    performance: u.performance || { activeChats: 0, resolution: 0, avgTime: '0m' }
                })) || [];


                // 3. Mock Volume Data (Real aggregation requires complex SQL or Edge Function)
                // For MVP, we'll keep the chart static or random based on real volume
                const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
                const volumeData = days.map(d => ({
                    name: d,
                    uv: Math.floor(Math.random() * 500) + 100 // Randomized for liveliness based on real activity? No, keep it simple.
                }));

                setStats({
                    newMessages,
                    pending,
                    activeChats,
                    avgTime: '2m 15s', // Placeholder until we have message timestamp diffs
                    volumeData,
                    teamMembers: mappedTeam,
                    alerts: [] // You could query for specific urgent tags here
                });

            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();

        // Ideally add realtime subscription here for 'comm_conversations'

    }, [organizationId]);

    return { stats, loading };
};
