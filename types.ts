export enum ViewState {
  DASHBOARD = 'dashboard',
  CONVERSATIONS = 'conversations',
  CONTACTS = 'contacts',
  CAMPAIGNS = 'campaigns',
  TEMPLATES = 'templates',
  SETTINGS = 'settings',
  SUPER_ADMIN_DASHBOARD = 'super_admin_dashboard', // Backoffice view
  HELP = 'help',
}

// Database Table: comm_users
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',   // System Owner
  OWNER = 'OWNER',               // Tenant Owner
  ASSISTANT = 'ASSISTANT',       // Manager / Supervisor
  AGENT = 'AGENT',               // Standard Operator
}

// Database Table: comm_organizations
export interface Organization {
  id: string; // e.g., 'org_1'
  name: string;
  plan: 'BASIC' | 'PRO' | 'ENTERPRISE';
  status: 'ACTIVE' | 'SUSPENDED' | 'TRIAL';
  settings?: {
    primaryColor?: string;
    logoUrl?: string;
  };
  integrations?: {
    whatsapp?: {
      phoneId: string;
      accessToken: string;
      verifyToken: string;
      businessAccountId: string;
    };
    facebook?: {
      pageId: string;
      accessToken: string;
    };
  };
  createdAt: string;
}

// Database Table: comm_users
export interface User {
  id: string;
  organizationId: string; // Foreign Key to comm_organizations
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  preferences?: {
    darkMode: boolean;
    notifications: boolean;
    language: 'es' | 'en';
  };
  performance: {
    activeChats: number;
    resolution: number; // percentage
    avgTime: string;
  };
}

// Database Table: comm_contacts
export interface Contact {
  id: string;
  organizationId: string; // Scoped to Organization
  name: string;
  phone: string;
  email: string;
  avatar: string;
  isVip: boolean;
  location?: string;
  tags: string[]; // e.g., ["Patient-ID:123", "Post-Op"]
  lastSeen: string;
  company?: string;
  assignedTo?: string; // User ID of the assigned agent
  customFields?: Record<string, string>; // Flexible field for market-specific data
}

// Database Table: comm_messages
export interface Message {
  id: string;
  conversationId: string;
  senderId: string; // 'me', contactId, or 'system'
  text: string;
  timestamp: string;
  type: 'text' | 'image' | 'file' | 'note' | 'template'; // Added 'template'
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  // WhatsApp Cloud API Statuses
  status?: 'queued' | 'sent' | 'delivered' | 'read' | 'failed';
}

// Database Table: comm_conversations
export interface Conversation {
  id: string;
  organizationId: string;
  contactId: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'resolved' | 'snoozed';
  tags: string[];
  platform: 'whatsapp' | 'instagram' | 'messenger';
  messages: Message[];
  // SLA & Business Logic
  slaDeadline?: string; // ISO String for 24h window
  assignedTo?: string; // User ID
}

export interface Appointment {
  id: string;
  organizationId: string;
  contactId: string;
  date: string;
  time: string;
  type: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

// Database Table: comm_campaigns
export interface Campaign {
  id: string;
  organizationId: string;
  name: string;
  status: 'draft' | 'scheduled' | 'running' | 'completed';
  sentDate?: string;
  audienceSize: number;
  deliveredCount: number;
  readCount: number;
  templateName: string;
  tagFilter?: string; // e.g., 'VIP', 'Lead'
}

// --- WhatsApp Templates Interfaces ---

export type WhatsAppTemplateCategory = 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
export type WhatsAppTemplateStatus = 'APPROVED' | 'PENDING' | 'REJECTED';

export interface WhatsAppTemplateComponent {
  type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';
  format?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  text?: string;
  buttons?: {
    type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER';
    text: string;
    url?: string;
    phoneNumber?: string;
  }[];
}

export interface WhatsAppTemplate {
  id: string;
  organizationId: string; // Templates are often owned by the WABA account
  name: string;
  language: string;
  category: WhatsAppTemplateCategory;
  status: WhatsAppTemplateStatus;
  components: WhatsAppTemplateComponent[];
}