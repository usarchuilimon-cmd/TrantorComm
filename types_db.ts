export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    // Allows to automatically instantiate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    __InternalSupabase: {
        PostgrestVersion: "14.1"
    }
    public: {
        Tables: {
            activities: {
                Row: {
                    created_at: string | null
                    id: string
                    subtitle: string | null
                    title: string
                    type: string
                    user_id: string | null
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    subtitle?: string | null
                    title: string
                    type: string
                    user_id?: string | null
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    subtitle?: string | null
                    title?: string
                    type?: string
                    user_id?: string | null
                }
                Relationships: []
            }
            audit_logs: {
                Row: {
                    action: string
                    created_at: string | null
                    id: string
                    new_data: Json | null
                    old_data: Json | null
                    organization_id: string | null
                    record_id: string | null
                    table_name: string
                    user_id: string | null
                }
                Insert: {
                    action: string
                    created_at?: string | null
                    id?: string
                    new_data?: Json | null
                    old_data?: Json | null
                    organization_id?: string | null
                    record_id?: string | null
                    table_name: string
                    user_id?: string | null
                }
                Update: {
                    action?: string
                    created_at?: string | null
                    id?: string
                    new_data?: Json | null
                    old_data?: Json | null
                    organization_id?: string | null
                    record_id?: string | null
                    table_name?: string
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "audit_logs_organization_id_fkey"
                        columns: ["organization_id"]
                        isOneToOne: false
                        referencedRelation: "tracker_organizations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            comm_campaigns: {
                Row: {
                    audience_size: number | null
                    created_at: string | null
                    delivered_count: number | null
                    id: string
                    name: string
                    organization_id: string | null
                    read_count: number | null
                    sent_date: string | null
                    status: string | null
                    tag_filter: string | null
                    template_name: string | null
                }
                Insert: {
                    audience_size?: number | null
                    created_at?: string | null
                    delivered_count?: number | null
                    id: string
                    name: string
                    organization_id?: string | null
                    read_count?: number | null
                    sent_date?: string | null
                    status?: string | null
                    tag_filter?: string | null
                    template_name?: string | null
                }
                Update: {
                    audience_size?: number | null
                    created_at?: string | null
                    delivered_count?: number | null
                    id?: string
                    name?: string
                    organization_id?: string | null
                    read_count?: number | null
                    sent_date?: string | null
                    status?: string | null
                    tag_filter?: string | null
                    template_name?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "comm_campaigns_organization_id_fkey"
                        columns: ["organization_id"]
                        isOneToOne: false
                        referencedRelation: "comm_organizations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            comm_contacts: {
                Row: {
                    assigned_to: string | null
                    avatar: string | null
                    company: string | null
                    created_at: string | null
                    custom_fields: Json | null
                    email: string | null
                    id: string
                    is_vip: boolean | null
                    last_seen: string | null
                    location: string | null
                    name: string
                    organization_id: string | null
                    phone: string | null
                    tags: string[] | null
                }
                Insert: {
                    assigned_to?: string | null
                    avatar?: string | null
                    company?: string | null
                    created_at?: string | null
                    custom_fields?: Json | null
                    email?: string | null
                    id: string
                    is_vip?: boolean | null
                    last_seen?: string | null
                    location?: string | null
                    name: string
                    organization_id?: string | null
                    phone?: string | null
                    tags?: string[] | null
                }
                Update: {
                    assigned_to?: string | null
                    avatar?: string | null
                    company?: string | null
                    created_at?: string | null
                    custom_fields?: Json | null
                    email?: string | null
                    id?: string
                    is_vip?: boolean | null
                    last_seen?: string | null
                    location?: string | null
                    name?: string
                    organization_id?: string | null
                    phone?: string | null
                    tags?: string[] | null
                }
                Relationships: [
                    {
                        foreignKeyName: "comm_contacts_assigned_to_fkey"
                        columns: ["assigned_to"]
                        isOneToOne: false
                        referencedRelation: "comm_users"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "comm_contacts_organization_id_fkey"
                        columns: ["organization_id"]
                        isOneToOne: false
                        referencedRelation: "comm_organizations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            comm_conversations: {
                Row: {
                    assigned_to: string | null
                    contact_id: string | null
                    created_at: string | null
                    id: string
                    last_message: string | null
                    last_message_time: string | null
                    messages: Json | null
                    organization_id: string | null
                    platform: string | null
                    priority: string | null
                    sla_deadline: string | null
                    status: string | null
                    tags: string[] | null
                    unread_count: number | null
                }
                Insert: {
                    assigned_to?: string | null
                    contact_id?: string | null
                    created_at?: string | null
                    id: string
                    last_message?: string | null
                    last_message_time?: string | null
                    messages?: Json | null
                    organization_id?: string | null
                    platform?: string | null
                    priority?: string | null
                    sla_deadline?: string | null
                    status?: string | null
                    tags?: string[] | null
                    unread_count?: number | null
                }
                Update: {
                    assigned_to?: string | null
                    contact_id?: string | null
                    created_at?: string | null
                    id?: string
                    last_message?: string | null
                    last_message_time?: string | null
                    messages?: Json | null
                    organization_id?: string | null
                    platform?: string | null
                    priority?: string | null
                    sla_deadline?: string | null
                    status?: string | null
                    tags?: string[] | null
                    unread_count?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "comm_conversations_assigned_to_fkey"
                        columns: ["assigned_to"]
                        isOneToOne: false
                        referencedRelation: "comm_users"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "comm_conversations_contact_id_fkey"
                        columns: ["contact_id"]
                        isOneToOne: false
                        referencedRelation: "comm_contacts"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "comm_conversations_organization_id_fkey"
                        columns: ["organization_id"]
                        isOneToOne: false
                        referencedRelation: "comm_organizations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            comm_organizations: {
                Row: {
                    created_at: string | null
                    id: string
                    integrations: Json | null
                    name: string
                    plan: string
                    settings: Json | null
                    status: string
                }
                Insert: {
                    created_at?: string | null
                    id: string
                    integrations?: Json | null
                    name: string
                    plan?: string
                    settings?: Json | null
                    status?: string
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    integrations?: Json | null
                    name?: string
                    plan?: string
                    settings?: Json | null
                    status?: string
                }
                Relationships: []
            }
            comm_templates: {
                Row: {
                    category: string | null
                    components: Json | null
                    created_at: string | null
                    id: string
                    language: string | null
                    name: string
                    organization_id: string | null
                    status: string | null
                }
                Insert: {
                    category?: string | null
                    components?: Json | null
                    created_at?: string | null
                    id: string
                    language?: string | null
                    name: string
                    organization_id?: string | null
                    status?: string | null
                }
                Update: {
                    category?: string | null
                    components?: Json | null
                    created_at?: string | null
                    id?: string
                    language?: string | null
                    name?: string
                    organization_id?: string | null
                    status?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "comm_templates_organization_id_fkey"
                        columns: ["organization_id"]
                        isOneToOne: false
                        referencedRelation: "comm_organizations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            comm_users: {
                Row: {
                    avatar: string | null
                    created_at: string | null
                    email: string
                    id: string
                    name: string
                    organization_id: string | null
                    performance: Json | null
                    preferences: Json | null
                    role: string
                    status: string | null
                }
                Insert: {
                    avatar?: string | null
                    created_at?: string | null
                    email: string
                    id: string
                    name: string
                    organization_id?: string | null
                    performance?: Json | null
                    preferences?: Json | null
                    role: string
                    status?: string | null
                }
                Update: {
                    avatar?: string | null
                    created_at?: string | null
                    email?: string
                    id?: string
                    name?: string
                    organization_id?: string | null
                    performance?: Json | null
                    preferences?: Json | null
                    role?: string
                    status?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "comm_users_organization_id_fkey"
                        columns: ["organization_id"]
                        isOneToOne: false
                        referencedRelation: "comm_organizations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            ideas: {
                Row: {
                    category: string | null
                    created_at: string | null
                    description: string | null
                    id: string
                    priority: string | null
                    progress: number | null
                    roi: Json | null
                    title: string
                    user_id: string
                }
                Insert: {
                    category?: string | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    priority?: string | null
                    progress?: number | null
                    roi?: Json | null
                    title: string
                    user_id: string
                }
                Update: {
                    category?: string | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    priority?: string | null
                    progress?: number | null
                    roi?: Json | null
                    title?: string
                    user_id?: string
                }
                Relationships: []
            }
            invitations: {
                Row: {
                    created_at: string | null
                    email: string
                    expires_at: string
                    id: string
                    organization_id: string
                    role: string
                    status: string
                    token: string
                }
                Insert: {
                    created_at?: string | null
                    email: string
                    expires_at: string
                    id?: string
                    organization_id: string
                    role?: string
                    status?: string
                    token: string
                }
                Update: {
                    created_at?: string | null
                    email?: string
                    expires_at?: string
                    id?: string
                    organization_id?: string
                    role?: string
                    status?: string
                    token?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "invitations_organization_id_fkey"
                        columns: ["organization_id"]
                        isOneToOne: false
                        referencedRelation: "organizations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            organizations: {
                Row: {
                    created_at: string
                    id: string
                    name: string
                    plan: string | null
                    stripe_customer_id: string | null
                }
                Insert: {
                    created_at?: string
                    id?: string
                    name: string
                    plan?: string | null
                    stripe_customer_id?: string | null
                }
                Update: {
                    created_at?: string
                    id?: string
                    name?: string
                    plan?: string | null
                    stripe_customer_id?: string | null
                }
                Relationships: []
            }
            profiles: {
                Row: {
                    access_level: number | null
                    avatar_url: string | null
                    designation: string | null
                    email: string | null
                    full_name: string | null
                    id: string
                    organization_id: string | null
                    role: string | null
                    team_id: string | null
                    updated_at: string | null
                }
                Insert: {
                    access_level?: number | null
                    avatar_url?: string | null
                    designation?: string | null
                    email?: string | null
                    full_name?: string | null
                    id: string
                    organization_id?: string | null
                    role?: string | null
                    team_id?: string | null
                    updated_at?: string | null
                }
                Update: {
                    access_level?: number | null
                    avatar_url?: string | null
                    designation?: string | null
                    email?: string | null
                    full_name?: string | null
                    id?: string
                    organization_id?: string | null
                    role?: string | null
                    team_id?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_organization_id_fkey"
                        columns: ["organization_id"]
                        isOneToOne: false
                        referencedRelation: "organizations"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "profiles_team_id_fkey"
                        columns: ["team_id"]
                        isOneToOne: false
                        referencedRelation: "teams"
                        referencedColumns: ["id"]
                    },
                ]
            }
            routines: {
                Row: {
                    created_at: string | null
                    data: Json | null
                    description: string | null
                    id: string
                    title: string
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    data?: Json | null
                    description?: string | null
                    id?: string
                    title: string
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    data?: Json | null
                    description?: string | null
                    id?: string
                    title?: string
                    user_id?: string
                }
                Relationships: []
            }
            subscriptions: {
                Row: {
                    cancel_at_period_end: boolean | null
                    created_at: string
                    current_period_end: string | null
                    ended_at: string | null
                    id: string
                    organization_id: string
                    price_id: string | null
                    status: string | null
                }
                Insert: {
                    cancel_at_period_end?: boolean | null
                    created_at?: string
                    current_period_end?: string | null
                    ended_at?: string | null
                    id: string
                    organization_id: string
                    price_id?: string | null
                    status?: string | null
                }
                Update: {
                    cancel_at_period_end?: boolean | null
                    created_at?: string
                    current_period_end?: string | null
                    ended_at?: string | null
                    id?: string
                    organization_id?: string
                    price_id?: string | null
                    status?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "subscriptions_organization_id_fkey"
                        columns: ["organization_id"]
                        isOneToOne: false
                        referencedRelation: "organizations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            tasks_tasks: {
                Row: {
                    actual_cost: number | null
                    actual_time: number | null
                    assignee: string | null
                    comments: Json | null
                    completed_at: string | null
                    created_at: string | null
                    currency: string | null
                    description: string | null
                    due_date: string | null
                    estimated_cost: number | null
                    estimated_time: number | null
                    id: string
                    is_important: boolean | null
                    is_urgent: boolean | null
                    organization_id: string | null
                    priority: string | null
                    related_to: string | null
                    status: string | null
                    team_id: string | null
                    title: string
                }
                Insert: {
                    actual_cost?: number | null
                    actual_time?: number | null
                    assignee?: string | null
                    comments?: Json | null
                    completed_at?: string | null
                    created_at?: string | null
                    currency?: string | null
                    description?: string | null
                    due_date?: string | null
                    estimated_cost?: number | null
                    estimated_time?: number | null
                    id?: string
                    is_important?: boolean | null
                    is_urgent?: boolean | null
                    organization_id?: string | null
                    priority?: string | null
                    related_to?: string | null
                    status?: string | null
                    team_id?: string | null
                    title: string
                }
                Update: {
                    actual_cost?: number | null
                    actual_time?: number | null
                    assignee?: string | null
                    comments?: Json | null
                    completed_at?: string | null
                    created_at?: string | null
                    currency?: string | null
                    description?: string | null
                    due_date?: string | null
                    estimated_cost?: number | null
                    estimated_time?: number | null
                    id?: string
                    is_important?: boolean | null
                    is_urgent?: boolean | null
                    organization_id?: string | null
                    priority?: string | null
                    related_to?: string | null
                    status?: string | null
                    team_id?: string | null
                    title?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "tasks_tasks_organization_id_fkey"
                        columns: ["organization_id"]
                        isOneToOne: false
                        referencedRelation: "organizations"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "tasks_tasks_team_id_fkey"
                        columns: ["team_id"]
                        isOneToOne: false
                        referencedRelation: "teams"
                        referencedColumns: ["id"]
                    },
                ]
            }
            teams: {
                Row: {
                    created_at: string
                    id: string
                    leader_id: string | null
                    name: string
                    organization_id: string
                }
                Insert: {
                    created_at?: string
                    id?: string
                    leader_id?: string | null
                    name: string
                    organization_id: string
                }
                Update: {
                    created_at?: string
                    id?: string
                    leader_id?: string | null
                    name?: string
                    organization_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "teams_leader_id_fkey"
                        columns: ["leader_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "teams_organization_id_fkey"
                        columns: ["organization_id"]
                        isOneToOne: false
                        referencedRelation: "organizations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            tracker_action_items: {
                Row: {
                    assigned_to: string
                    due_date: string | null
                    id: string
                    is_critical: boolean | null
                    meeting_minute_id: string | null
                    organization_id: string | null
                    status: string | null
                    task: string
                }
                Insert: {
                    assigned_to: string
                    due_date?: string | null
                    id: string
                    is_critical?: boolean | null
                    meeting_minute_id?: string | null
                    organization_id?: string | null
                    status?: string | null
                    task: string
                }
                Update: {
                    assigned_to?: string
                    due_date?: string | null
                    id?: string
                    is_critical?: boolean | null
                    meeting_minute_id?: string | null
                    organization_id?: string | null
                    status?: string | null
                    task?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "tracker_action_items_meeting_minute_id_fkey"
                        columns: ["meeting_minute_id"]
                        isOneToOne: false
                        referencedRelation: "tracker_meeting_minutes"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "tracker_action_items_organization_id_fkey"
                        columns: ["organization_id"]
                        isOneToOne: false
                        referencedRelation: "tracker_organizations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            tracker_custom_developments: {
                Row: {
                    delivery_date: string | null
                    description: string | null
                    id: string
                    organization_id: string | null
                    requested_by: string
                    status: string
                    title: string
                }
                Insert: {
                    delivery_date?: string | null
                    description?: string | null
                    id: string
                    organization_id?: string | null
                    requested_by: string
                    status: string
                    title: string
                }
                Update: {
                    delivery_date?: string | null
                    description?: string | null
                    id?: string
                    organization_id?: string | null
                    requested_by?: string
                    status?: string
                    title?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "tracker_custom_developments_organization_id_fkey"
                        columns: ["organization_id"]
                        isOneToOne: false
                        referencedRelation: "tracker_organizations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            tracker_faqs: {
                Row: {
                    answer: string
                    category: string
                    id: string
                    organization_id: string | null
                    question: string
                }
                Insert: {
                    answer: string
                    category: string
                    id: string
                    organization_id?: string | null
                    question: string
                }
                Update: {
                    answer?: string
                    category?: string
                    id?: string
                    organization_id?: string | null
                    question?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "tracker_faqs_organization_id_fkey"
                        columns: ["organization_id"]
                        isOneToOne: false
                        referencedRelation: "tracker_organizations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            tracker_invitations: {
                Row: {
                    created_at: string | null
                    email: string
                    id: string
                    organization_id: string | null
                    role: Database["public"]["Enums"]["user_role"]
                    status: string
                }
                Insert: {
                    created_at?: string | null
                    email: string
                    id?: string
                    organization_id?: string | null
                    role?: Database["public"]["Enums"]["user_role"]
                    status?: string
                }
                Update: {
                    created_at?: string | null
                    email?: string
                    id?: string
                    organization_id?: string | null
                    role?: Database["public"]["Enums"]["user_role"]
                    status?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "tracker_invitations_organization_id_fkey"
                        columns: ["organization_id"]
                        isOneToOne: false
                        referencedRelation: "tracker_organizations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            tracker_meeting_minutes: {
                Row: {
                    agreements: string | null
                    created_at: string | null
                    created_by: string | null
                    id: string
                    meeting_date: string
                    notes: string | null
                    organization_id: string
                    participants: string[] | null
                    status: Database["public"]["Enums"]["meeting_status"] | null
                    title: string
                    updated_at: string | null
                }
                Insert: {
                    agreements?: string | null
                    created_at?: string | null
                    created_by?: string | null
                    id?: string
                    meeting_date: string
                    notes?: string | null
                    organization_id: string
                    participants?: string[] | null
                    status?: Database["public"]["Enums"]["meeting_status"] | null
                    title: string
                    updated_at?: string | null
                }
                Update: {
                    agreements?: string | null
                    created_at?: string | null
                    created_by?: string | null
                    id?: string
                    meeting_date?: string
                    notes?: string | null
                    organization_id?: string
                    participants?: string[] | null
                    status?: Database["public"]["Enums"]["meeting_status"] | null
                    title?: string
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "tracker_meeting_minutes_organization_id_fkey"
                        columns: ["organization_id"]
                        isOneToOne: false
                        referencedRelation: "tracker_organizations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            tracker_module_features: {
                Row: {
                    id: string
                    module_id: string | null
                    name: string
                    status: string
                }
                Insert: {
                    id?: string
                    module_id?: string | null
                    name: string
                    status: string
                }
                Update: {
                    id?: string
                    module_id?: string | null
                    name?: string
                    status?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "tracker_module_features_module_id_fkey"
                        columns: ["module_id"]
                        isOneToOne: false
                        referencedRelation: "tracker_modules"
                        referencedColumns: ["id"]
                    },
                ]
            }
            tracker_modules: {
                Row: {
                    description: string | null
                    icon: string | null
                    id: string
                    name: string
                    organization_id: string | null
                    owner: string | null
                    progress: number | null
                    responsibles: string | null
                    status: string
                }
                Insert: {
                    description?: string | null
                    icon?: string | null
                    id: string
                    name: string
                    organization_id?: string | null
                    owner?: string | null
                    progress?: number | null
                    responsibles?: string | null
                    status: string
                }
                Update: {
                    description?: string | null
                    icon?: string | null
                    id?: string
                    name?: string
                    organization_id?: string | null
                    owner?: string | null
                    progress?: number | null
                    responsibles?: string | null
                    status?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "tracker_modules_organization_id_fkey"
                        columns: ["organization_id"]
                        isOneToOne: false
                        referencedRelation: "tracker_organizations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            tracker_notifications: {
                Row: {
                    created_at: string | null
                    id: string
                    is_read: boolean | null
                    link: string | null
                    message: string
                    title: string
                    type: string | null
                    user_id: string | null
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    is_read?: boolean | null
                    link?: string | null
                    message: string
                    title: string
                    type?: string | null
                    user_id?: string | null
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    is_read?: boolean | null
                    link?: string | null
                    message?: string
                    title?: string
                    type?: string | null
                    user_id?: string | null
                }
                Relationships: []
            }
            tracker_organizations: {
                Row: {
                    actual_go_live: string | null
                    branding_config: Json | null
                    contact_email: string | null
                    created_at: string
                    health_status: string | null
                    id: string
                    name: string
                    project_stage: string | null
                    start_date: string | null
                    target_go_live: string | null
                }
                Insert: {
                    actual_go_live?: string | null
                    branding_config?: Json | null
                    contact_email?: string | null
                    created_at?: string
                    health_status?: string | null
                    id?: string
                    name: string
                    project_stage?: string | null
                    start_date?: string | null
                    target_go_live?: string | null
                }
                Update: {
                    actual_go_live?: string | null
                    branding_config?: Json | null
                    contact_email?: string | null
                    created_at?: string
                    health_status?: string | null
                    id?: string
                    name?: string
                    project_stage?: string | null
                    start_date?: string | null
                    target_go_live?: string | null
                }
                Relationships: []
            }
            tracker_profiles: {
                Row: {
                    created_at: string
                    department: string | null
                    email: string | null
                    full_name: string | null
                    id: string
                    job_title: string | null
                    organization_id: string | null
                    phone: string | null
                    role: Database["public"]["Enums"]["user_role"]
                }
                Insert: {
                    created_at?: string
                    department?: string | null
                    email?: string | null
                    full_name?: string | null
                    id: string
                    job_title?: string | null
                    organization_id?: string | null
                    phone?: string | null
                    role?: Database["public"]["Enums"]["user_role"]
                }
                Update: {
                    created_at?: string
                    department?: string | null
                    email?: string | null
                    full_name?: string | null
                    id?: string
                    job_title?: string | null
                    organization_id?: string | null
                    phone?: string | null
                    role?: Database["public"]["Enums"]["user_role"]
                }
                Relationships: [
                    {
                        foreignKeyName: "tracker_profiles_organization_id_fkey"
                        columns: ["organization_id"]
                        isOneToOne: false
                        referencedRelation: "tracker_organizations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            tracker_project_documents: {
                Row: {
                    category: Database["public"]["Enums"]["document_category"] | null
                    created_at: string | null
                    description: string | null
                    file_size: number | null
                    file_type: string | null
                    file_url: string
                    id: string
                    meeting_minute_id: string | null
                    name: string
                    organization_id: string
                    uploaded_by: string | null
                }
                Insert: {
                    category?: Database["public"]["Enums"]["document_category"] | null
                    created_at?: string | null
                    description?: string | null
                    file_size?: number | null
                    file_type?: string | null
                    file_url: string
                    id?: string
                    meeting_minute_id?: string | null
                    name: string
                    organization_id: string
                    uploaded_by?: string | null
                }
                Update: {
                    category?: Database["public"]["Enums"]["document_category"] | null
                    created_at?: string | null
                    description?: string | null
                    file_size?: number | null
                    file_type?: string | null
                    file_url?: string
                    id?: string
                    meeting_minute_id?: string | null
                    name?: string
                    organization_id?: string
                    uploaded_by?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "tracker_project_documents_meeting_minute_id_fkey"
                        columns: ["meeting_minute_id"]
                        isOneToOne: false
                        referencedRelation: "tracker_meeting_minutes"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "tracker_project_documents_organization_id_fkey"
                        columns: ["organization_id"]
                        isOneToOne: false
                        referencedRelation: "tracker_organizations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            tracker_ticket_updates: {
                Row: {
                    author: string
                    date: string | null
                    id: string
                    message: string
                    ticket_id: string | null
                    type: string
                }
                Insert: {
                    author: string
                    date?: string | null
                    id?: string
                    message: string
                    ticket_id?: string | null
                    type: string
                }
                Update: {
                    author?: string
                    date?: string | null
                    id?: string
                    message?: string
                    ticket_id?: string | null
                    type?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "tracker_ticket_updates_ticket_id_fkey"
                        columns: ["ticket_id"]
                        isOneToOne: false
                        referencedRelation: "tracker_tickets"
                        referencedColumns: ["id"]
                    },
                ]
            }
            tracker_tickets: {
                Row: {
                    created_at: string | null
                    description: string | null
                    id: string
                    module_id: string | null
                    module_name: string | null
                    organization_id: string | null
                    priority: string
                    requester: string
                    status: string
                    title: string
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    description?: string | null
                    id: string
                    module_id?: string | null
                    module_name?: string | null
                    organization_id?: string | null
                    priority: string
                    requester: string
                    status: string
                    title: string
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    module_id?: string | null
                    module_name?: string | null
                    organization_id?: string | null
                    priority?: string
                    requester?: string
                    status?: string
                    title?: string
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "tracker_tickets_module_id_fkey"
                        columns: ["module_id"]
                        isOneToOne: false
                        referencedRelation: "tracker_modules"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "tracker_tickets_organization_id_fkey"
                        columns: ["organization_id"]
                        isOneToOne: false
                        referencedRelation: "tracker_organizations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            tracker_timeline_events: {
                Row: {
                    created_at: string | null
                    date_range: string | null
                    description: string | null
                    id: string
                    modules_included: string[] | null
                    organization_id: string | null
                    phase: string
                    status: string
                }
                Insert: {
                    created_at?: string | null
                    date_range?: string | null
                    description?: string | null
                    id: string
                    modules_included?: string[] | null
                    organization_id?: string | null
                    phase: string
                    status: string
                }
                Update: {
                    created_at?: string | null
                    date_range?: string | null
                    description?: string | null
                    id?: string
                    modules_included?: string[] | null
                    organization_id?: string | null
                    phase?: string
                    status?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "tracker_timeline_events_organization_id_fkey"
                        columns: ["organization_id"]
                        isOneToOne: false
                        referencedRelation: "tracker_organizations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            tracker_timeline_tasks: {
                Row: {
                    id: string
                    status: string
                    timeline_event_id: string | null
                    title: string
                    week: string | null
                }
                Insert: {
                    id: string
                    status: string
                    timeline_event_id?: string | null
                    title: string
                    week?: string | null
                }
                Update: {
                    id?: string
                    status?: string
                    timeline_event_id?: string | null
                    title?: string
                    week?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "tracker_timeline_tasks_timeline_event_id_fkey"
                        columns: ["timeline_event_id"]
                        isOneToOne: false
                        referencedRelation: "tracker_timeline_events"
                        referencedColumns: ["id"]
                    },
                ]
            }
            tracker_tutorials: {
                Row: {
                    duration: string | null
                    id: string
                    organization_id: string | null
                    thumbnail_color: string | null
                    title: string
                    type: string | null
                }
                Insert: {
                    duration?: string | null
                    id: string
                    organization_id?: string | null
                    thumbnail_color?: string | null
                    title: string
                    type?: string | null
                }
                Update: {
                    duration?: string | null
                    id?: string
                    organization_id?: string | null
                    thumbnail_color?: string | null
                    title?: string
                    type?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "tracker_tutorials_organization_id_fkey"
                        columns: ["organization_id"]
                        isOneToOne: false
                        referencedRelation: "tracker_organizations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            tracker_user_organizations: {
                Row: {
                    created_at: string | null
                    id: string
                    is_default: boolean | null
                    organization_id: string
                    role: string
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    is_default?: boolean | null
                    organization_id: string
                    role?: string
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    is_default?: boolean | null
                    organization_id?: string
                    role?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "tracker_user_organizations_organization_id_fkey"
                        columns: ["organization_id"]
                        isOneToOne: false
                        referencedRelation: "tracker_organizations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            tracker_users: {
                Row: {
                    avatar: string | null
                    created_at: string | null
                    department: string
                    email: string
                    id: string
                    name: string
                    role: string
                }
                Insert: {
                    avatar?: string | null
                    created_at?: string | null
                    department: string
                    email: string
                    id?: string
                    name: string
                    role: string
                }
                Update: {
                    avatar?: string | null
                    created_at?: string | null
                    department?: string
                    email?: string
                    id?: string
                    name?: string
                    role?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            get_my_org_id: { Args: never; Returns: string }
            get_my_role: {
                Args: never
                Returns: Database["public"]["Enums"]["user_role"]
            }
        }
        Enums: {
            document_category: "REUNION" | "CONTRATO" | "DISENO" | "REPORTE" | "OTRO"
            meeting_status: "AGENDADA" | "REALIZADA" | "CANCELADA" | "REPROGRAMADA"
            user_role: "SUPER_ADMIN" | "ORG_ADMIN" | "CLIENT_USER"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
    DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
    EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
    public: {
        Enums: {
            document_category: ["REUNION", "CONTRATO", "DISENO", "REPORTE", "OTRO"],
            meeting_status: ["AGENDADA", "REALIZADA", "CANCELADA", "REPROGRAMADA"],
            user_role: ["SUPER_ADMIN", "ORG_ADMIN", "CLIENT_USER"],
        },
    },
} as const
