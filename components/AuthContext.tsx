import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { User } from '../types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string) => Promise<void>;
    signOut: () => Promise<void>;
    updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signIn: async () => { },
    signOut: async () => { },
    updateProfile: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (userId: string, email?: string) => {
        try {
            const { data, error } = await supabase
                .from('comm_users')
                .select('*')
                .eq('id', userId)
                .maybeSingle();

            if (error) {
                console.error('Error fetching user profile:', error);
                return null;
            }

            if (!data && email) {
                // Create new profile if missing, utilizing metadata if available
                console.log('User profile not found, creating new one...');

                // Retrieve metadata passed during sign up
                const { data: { session } } = await supabase.auth.getSession();
                const meta = session?.user?.user_metadata || {};

                const newProfile = {
                    id: userId,
                    organization_id: 'org_1', // Default organization for this demo
                    email: email,
                    name: meta.full_name || email.split('@')[0],
                    role: 'CLIENT_USER',
                    avatar: `https://i.pravatar.cc/150?u=${email}`,
                    status: 'online',
                    // Store extended fields in preferences or a separate profile table if schema allowed, 
                    // reusing 'preferences' for now to store the extra info without schema migration
                    preferences: {
                        darkMode: false,
                        notifications: true,
                        language: 'es',
                        phone: meta.phone || '',
                        position: meta.position || '',
                        department: meta.department || ''
                    },
                    performance: { activeChats: 0, resolution: 0, avgTime: '0m' }
                };

                const { error: insertError } = await supabase.from('comm_users').insert(newProfile);

                if (insertError) {
                    console.error('Error creating profile:', insertError);
                    return null;
                }

                return {
                    id: newProfile.id,
                    organizationId: newProfile.organization_id,
                    name: newProfile.name,
                    email: newProfile.email,
                    role: newProfile.role as any,
                    avatar: newProfile.avatar,
                    status: newProfile.status as any,
                    preferences: newProfile.preferences,
                    performance: newProfile.performance
                } as User;
            }

            if (!data) return null;

            // Transform DB user to App User
            return {
                id: data.id,
                organizationId: data.organization_id,
                name: data.name,
                email: data.email,
                role: data.role,
                avatar: data.avatar || 'https://i.pravatar.cc/150?u=default',
                status: data.status,
                preferences: data.preferences,
                performance: data.performance || {
                    activeChats: 0,
                    resolution: 0,
                    avgTime: '0m'
                }
            } as User;
        } catch (err) {
            console.error('Unexpected error fetching profile:', err);
            return null;
        }
    };

    useEffect(() => {
        let channel: any;

        const initAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                const profile = await fetchProfile(session.user.id, session.user.email);
                if (profile) {
                    setUser(profile);

                    // Subscribe to realtime changes for this user
                    channel = supabase
                        .channel(`public:comm_users:${profile.id}`)
                        .on(
                            'postgres_changes',
                            { event: 'UPDATE', schema: 'public', table: 'comm_users', filter: `id=eq.${profile.id}` },
                            (payload) => {
                                console.log('Profile updated realtime:', payload);
                                setUser(prev => prev ? ({ ...prev, ...payload.new }) : null);
                            }
                        )
                        .subscribe();
                }
            }
            setLoading(false);
        };

        initAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
                    // Cleanup previous channel if exists
                    if (channel) supabase.removeChannel(channel);

                    const profile = await fetchProfile(session.user.id, session.user.email);
                    setUser(profile);

                    if (profile) {
                        channel = supabase
                            .channel(`public:comm_users:${profile.id}`)
                            .on(
                                'postgres_changes',
                                { event: 'UPDATE', schema: 'public', table: 'comm_users', filter: `id=eq.${profile.id}` },
                                (payload) => {
                                    console.log('Profile updated realtime:', payload);
                                    setUser(prev => prev ? ({ ...prev, ...payload.new }) : null);
                                }
                            )
                            .subscribe();
                    }
                }
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                if (channel) supabase.removeChannel(channel);
            }
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
            if (channel) supabase.removeChannel(channel);
        };
    }, []);

    const signIn = async (email: string) => {
        // Not used directly if Login component handles it, but valid for Context
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) throw error;
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    const updateProfile = async (updates: Partial<User>) => {
        if (!user) return;
        try {
            // 1. Update Local State immediately for UI responsiveness
            setUser({ ...user, ...updates });

            // 2. Persist to DB
            const { error } = await supabase
                .from('comm_users')
                .update({
                    name: updates.name,
                    avatar: updates.avatar,
                    preferences: updates.preferences,
                    status: updates.status
                })
                .eq('id', user.id);

            if (error) {
                console.error('Error persisting profile update:', error);
                // Optionally revert local state here if strict consistency is needed
                // setUser(user); 
                throw error;
            }
        } catch (err) {
            console.error('Failed to update profile:', err);
            throw err;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signOut, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
