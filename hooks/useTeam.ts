import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { User } from '../types';

export const useTeam = (organizationId: string) => {
    const [team, setTeam] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!organizationId) {
            setLoading(false);
            return;
        }

        const fetchTeam = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('comm_users')
                    .select('*')
                    .eq('organization_id', organizationId);

                if (error) {
                    throw error;
                }

                const mappedTeam: User[] = data.map((u: any) => ({
                    id: u.id,
                    organizationId: u.organization_id,
                    name: u.name,
                    email: u.email,
                    role: u.role,
                    avatar: u.avatar,
                    status: u.status,
                    preferences: u.preferences,
                    performance: u.performance || { activeChats: 0, resolution: 0, avgTime: '0m' }
                }));

                setTeam(mappedTeam);
            } catch (error) {
                console.error('Error fetching team:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeam();

        // Optional: Realtime subscription if needed
    }, [organizationId]);

    return { team, loading };
};
