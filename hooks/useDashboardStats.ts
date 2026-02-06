import { useState, useEffect, useRef } from 'react';
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

export const useDashboardStats = (organizationId: string, timeRange: '7d' | '24h' = '7d') => {
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

    // Track previous org to prevent full page reload on just time filter changes
    const prevOrgId = useRef(organizationId);

    useEffect(() => {
        if (!organizationId) return;

        const fetchStats = async () => {
            try {
                // Only show full loading spinner if Organization changed (context switch)
                // or if it's the very first load (covered by initial state)
                if (prevOrgId.current !== organizationId) {
                    setLoading(true);
                    prevOrgId.current = organizationId;
                }

                // Note: unique loading for timeRange could be added, but user specifically asked to avoid "reload"

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


                // 3. Mock Volume Data based on Time Range
                let volumeData = [];
                if (timeRange === '7d') {
                    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
                    volumeData = days.map(d => ({
                        name: d,
                        uv: Math.floor(Math.random() * 500) + 100
                    }));
                } else {
                    // 24h view - 4 hour intervals
                    const hours = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'];
                    volumeData = hours.map(h => ({
                        name: h,
                        uv: Math.floor(Math.random() * 120) + 20
                    }));
                }

                setStats({
                    newMessages,
                    pending,
                    activeChats,
                    avgTime: '2m 15s',
                    volumeData,
                    teamMembers: mappedTeam,
                    alerts: []
                });

            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();

    }, [organizationId, timeRange]);

    return { stats, loading };
};
