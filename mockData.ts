import { User, Contact, Conversation, Appointment, WhatsAppTemplate, Campaign, UserRole, Organization } from './types';

// --- Organizations (Tenants) ---
export const ORGANIZATIONS: Organization[] = [
  {
    id: 'org_1',
    name: 'Clínica Dental Monterrey',
    plan: 'PRO',
    status: 'ACTIVE',
    createdAt: '2024-01-15',
    settings: { primaryColor: '#2563eb' }
  },
  {
    id: 'org_2',
    name: 'Mantenimiento Express',
    plan: 'BASIC',
    status: 'ACTIVE',
    createdAt: '2024-03-10',
    settings: { primaryColor: '#ea580c' }
  },
  {
    id: 'org_admin',
    name: 'SyncFlow Systems',
    plan: 'ENTERPRISE',
    status: 'ACTIVE',
    createdAt: '2023-01-01',
  }
];

// --- Users ---
export const SUPER_ADMIN_USER: User = {
  id: 'sa1',
  organizationId: 'org_admin',
  name: 'Juan Pérez (Owner)',
  email: 'admin@syncflow.com',
  role: UserRole.SUPER_ADMIN,
  avatar: 'https://i.pravatar.cc/150?u=SuperAdmin',
  status: 'online',
  preferences: { darkMode: true, notifications: true, language: 'es' },
  performance: { activeChats: 0, resolution: 0, avgTime: '0m' }
};

export const CURRENT_USER: User = {
  id: 'u1',
  organizationId: 'org_1',
  name: 'Alex Rivera',
  email: 'alex@dentalmty.com',
  role: UserRole.OWNER,
  avatar: 'https://i.pravatar.cc/150?u=AlexRivera',
  status: 'online',
  preferences: { darkMode: false, notifications: true, language: 'es' },
  performance: { activeChats: 0, resolution: 0, avgTime: '0m' }
};

export const TEAM_MEMBERS: User[] = [
  {
    id: 't1',
    organizationId: 'org_1',
    name: 'Sofia Garza',
    email: 'sofia@dentalmty.com',
    role: UserRole.ASSISTANT,
    avatar: 'https://i.pravatar.cc/150?u=SofiaGarza',
    status: 'online',
    performance: { activeChats: 12, resolution: 94, avgTime: '1m 45s' }
  },
  {
    id: 't2',
    organizationId: 'org_1',
    name: 'Marcelo Treviño',
    email: 'marcelo@dentalmty.com',
    role: UserRole.AGENT,
    avatar: 'https://i.pravatar.cc/150?u=Marcelo',
    status: 'away',
    performance: { activeChats: 8, resolution: 88, avgTime: '2m 10s' }
  },
  {
    id: 't3',
    organizationId: 'org_2', // Different Tenant
    name: 'Elena Rodríguez',
    email: 'elena@manto.com',
    role: UserRole.OWNER,
    avatar: 'https://i.pravatar.cc/150?u=Elena',
    status: 'online',
    performance: { activeChats: 15, resolution: 91, avgTime: '3m 05s' }
  }
];

// --- Contacts ---
export const CONTACTS: Contact[] = [
  {
    id: 'c1',
    organizationId: 'org_1',
    name: 'Ing. Roberto Cantú',
    phone: '+52 81 8123 4567',
    email: 'rcantu@cemex.com',
    avatar: 'https://i.pravatar.cc/150?u=Roberto',
    isVip: true,
    location: 'San Pedro Garza García',
    tags: ['Paciente nuevo', 'Ortodoncia'],
    lastSeen: '2m',
    company: 'Cemex',
    assignedTo: 'u1', // Alex
    customFields: { 'patient_id': 'P-9981', 'insurance': 'GNP' }
  },
  {
    id: 'c2',
    organizationId: 'org_1',
    name: 'Dra. Ana Lucia Guerra',
    phone: '+52 81 1234 5678',
    email: 'ana.guerra@hospitalzambrano.com',
    avatar: 'https://i.pravatar.cc/150?u=Ana',
    isVip: false,
    location: 'Valle Oriente',
    tags: ['Consulta General'],
    lastSeen: '1h',
    company: 'Hospital Zambrano',
    assignedTo: 't1' // Sofia
  },
  // Tenant 2 Contact (should not be seen by org_1)
  {
    id: 'c3',
    organizationId: 'org_2',
    name: 'Luis Hernández',
    phone: '+52 81 8300 0000',
    email: 'luis.h@tec.mx',
    avatar: 'https://i.pravatar.cc/150?u=Luis',
    isVip: false,
    location: 'Tec de Monterrey',
    tags: ['Mantenimiento AC'],
    lastSeen: '3h',
    company: 'ITESM',
    assignedTo: 't3'
  }
];

// --- Conversations ---
export const CONVERSATIONS: Conversation[] = [
  {
    id: 'conv1',
    organizationId: 'org_1',
    contactId: 'c1',
    lastMessage: '¿Podemos reagendar la sesión para el jueves?',
    lastMessageTime: '09:41 AM',
    unreadCount: 2,
    priority: 'high',
    status: 'open',
    tags: ['Urgente', 'Ortodoncia'],
    platform: 'whatsapp',
    messages: [
      { id: 'm1', conversationId: 'conv1', senderId: 'c1', text: '¡Hola! Me gustaría agendar una cita de valoración.', timestamp: '09:41 AM', type: 'text', status: 'read' },
      { id: 'm2', conversationId: 'conv1', senderId: 'system', text: 'El paciente seleccionó "Primera vez" en el chatbot.', timestamp: '09:42 AM', type: 'note' },
      { id: 'm3', conversationId: 'conv1', senderId: 'me', text: '¡Hola Roberto! Claro que sí. Tenemos disponibilidad el Jueves a las 4pm.', timestamp: '09:45 AM', type: 'text', status: 'read' },
      { id: 'm4', conversationId: 'conv1', senderId: 'me', text: 'Folleto_Ortodoncia.pdf', timestamp: '09:45 AM', type: 'file', fileName: 'Folleto.pdf', fileSize: '1.2 MB', status: 'read' },
      { id: 'm5', conversationId: 'conv1', senderId: 'c1', text: 'Perfecto. ¿Podemos confirmar?', timestamp: '09:48 AM', type: 'text', status: 'delivered' }
    ],
    assignedTo: 'u1'
  },
  {
    id: 'conv2',
    organizationId: 'org_1',
    contactId: 'c2',
    lastMessage: 'Ya envié los documentos por correo.',
    lastMessageTime: '10:15 AM',
    unreadCount: 0,
    priority: 'medium',
    status: 'open',
    tags: ['Docs'],
    platform: 'whatsapp',
    messages: [
      { id: 'm6', conversationId: 'conv2', senderId: 'c2', text: 'Hola, ya te envié la constancia fiscal.', timestamp: '10:15 AM', type: 'text', status: 'read' }
    ],
    assignedTo: 't1' // Sofia
  },
  // Tenant 2 Conversation
  {
    id: 'conv3',
    organizationId: 'org_2',
    contactId: 'c3',
    lastMessage: 'El técnico va en camino.',
    lastMessageTime: 'Ayer',
    unreadCount: 0,
    priority: 'low',
    status: 'resolved',
    tags: [],
    platform: 'whatsapp',
    messages: [],
    assignedTo: 't3'
  }
];

export const APPOINTMENTS: Appointment[] = [
  {
    id: 'apt1',
    contactId: 'c1',
    date: '24 OCT',
    time: '10:00 AM',
    type: 'Consulta',
    status: 'confirmed'
  },
  {
    id: 'apt2',
    contactId: 'c2',
    date: '25 OCT',
    time: '11:30 AM',
    type: 'Limpieza',
    status: 'pending'
  }
];

export const WHATSAPP_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'wt1',
    organizationId: 'org_1',
    name: 'bienvenida_paciente',
    language: 'es_MX',
    category: 'MARKETING',
    status: 'APPROVED',
    components: [
      { type: 'HEADER', format: 'IMAGE' },
      { type: 'BODY', text: '¡Hola {{1}}! 👋 Bienvenido a Clínica Dental Monterrey. \n\nGracias por su confianza.' },
      { type: 'FOOTER', text: 'Responder STOP para baja' },
      {
        type: 'BUTTONS', buttons: [
          { type: 'QUICK_REPLY', text: 'Agendar Cita' }
        ]
      }
    ]
  }
];

export const CAMPAIGNS: Campaign[] = [
  {
    id: 'camp1',
    organizationId: 'org_1',
    name: 'Promo Limpieza 2x1',
    status: 'completed',
    sentDate: '15 JUN 2024',
    audienceSize: 1250,
    deliveredCount: 1200,
    readCount: 980,
    templateName: 'bienvenida_paciente',
    tagFilter: 'Todos'
  }
];