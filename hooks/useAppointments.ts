import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Appointment } from '../types';

export const useAppointments = (organizationId: string) => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!organizationId) {
            setLoading(false);
            return;
        }

        const fetchAppointments = async () => {
            try {
                const { data, error } = await supabase
                    .from('comm_appointments')
                    .select('*')
                    .eq('organization_id', organizationId);

                if (error) throw error;

                const mapped: Appointment[] = data.map(row => ({
                    id: row.id,
                    organizationId: row.organization_id,
                    contactId: row.contact_id,
                    date: row.date,
                    time: row.time,
                    type: row.type,
                    status: row.status as any
                }));
                setAppointments(mapped);
            } catch (err: any) {
                console.error('Error fetching appointments:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();

        // Subscriptions
        const channel = supabase
            .channel('public:comm_appointments')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'comm_appointments', filter: `organization_id=eq.${organizationId}` },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        const newAppt: Appointment = {
                            id: payload.new.id,
                            organizationId: payload.new.organization_id,
                            contactId: payload.new.contact_id,
                            date: payload.new.date,
                            time: payload.new.time,
                            type: payload.new.type,
                            status: payload.new.status as any
                        };
                        setAppointments(prev => [newAppt, ...prev]);
                    } else if (payload.eventType === 'UPDATE') {
                        setAppointments(prev => prev.map(a => a.id === payload.new.id ? { ...a, status: payload.new.status, date: payload.new.date, time: payload.new.time } : a));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };

    }, [organizationId]);

    return { appointments, loading };
};
