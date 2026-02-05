export enum ViewState {
  DASHBOARD = 'dashboard',
  CONVERSATIONS = 'conversations',
  CONTACTS = 'contacts',
  CAMPAIGNS = 'campaigns',
  SETTINGS = 'settings',
}

export interface User {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  performance: {
    activeChats: number;
    resolution: number; // percentage
    avgTime: string;
  };
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  isVip: boolean;
  location?: string;
  tags: string[];
  lastSeen: string;
  company?: string;
  assignedTo?: string; // User ID of the assigned agent
}

export interface Message {
  id: string;
  senderId: string; // 'me' or contactId
  text: string;
  timestamp: string;
  type: 'text' | 'image' | 'file' | 'note';
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  // WhatsApp Cloud API Statuses
  status?: 'queued' | 'sent' | 'delivered' | 'read' | 'failed';
}

export interface Conversation {
  id: string;
  contactId: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'resolved' | 'snoozed';
  tags: string[];
  platform: 'whatsapp' | 'instagram' | 'messenger';
  messages: Message[];
}

export interface Appointment {
  id: string;
  contactId: string;
  date: string;
  time: string;
  type: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface Campaign {
  id: string;
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
  name: string;
  language: string;
  category: WhatsAppTemplateCategory;
  status: WhatsAppTemplateStatus;
  components: WhatsAppTemplateComponent[];
}