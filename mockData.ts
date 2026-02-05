import { User, Contact, Conversation, Appointment, WhatsAppTemplate, Campaign } from './types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Alex Rivera',
  role: 'Admin Senior',
  avatar: 'https://i.pravatar.cc/150?u=AlexRivera',
  status: 'online',
  performance: { activeChats: 0, resolution: 0, avgTime: '0m' }
};

export const TEAM_MEMBERS: User[] = [
  {
    id: 't1',
    name: 'Sofia Garza',
    role: 'Soporte Nivel 1',
    avatar: 'https://i.pravatar.cc/150?u=SofiaGarza',
    status: 'online',
    performance: { activeChats: 12, resolution: 94, avgTime: '1m 45s' }
  },
  {
    id: 't2',
    name: 'Marcelo Treviño',
    role: 'Ventas',
    avatar: 'https://i.pravatar.cc/150?u=Marcelo',
    status: 'away',
    performance: { activeChats: 8, resolution: 88, avgTime: '2m 10s' }
  },
  {
    id: 't3',
    name: 'Elena Rodríguez',
    role: 'Especialista',
    avatar: 'https://i.pravatar.cc/150?u=Elena',
    status: 'online',
    performance: { activeChats: 15, resolution: 91, avgTime: '3m 05s' }
  }
];

export const CONTACTS: Contact[] = [
  {
    id: 'c1',
    name: 'Ing. Roberto Cantú',
    phone: '+52 81 8123 4567',
    email: 'rcantu@cemex.com',
    avatar: 'https://i.pravatar.cc/150?u=Roberto',
    isVip: true,
    location: 'San Pedro Garza García',
    tags: ['Lead', 'Corporativo'],
    lastSeen: '2m',
    company: 'Cemex',
    assignedTo: 'u1' // Assigned to Alex
  },
  {
    id: 'c2',
    name: 'Dra. Ana Lucia Guerra',
    phone: '+52 81 1234 5678',
    email: 'ana.guerra@hospitalzambrano.com',
    avatar: 'https://i.pravatar.cc/150?u=Ana',
    isVip: false,
    location: 'Valle Oriente',
    tags: ['Doctora', 'Consulta'],
    lastSeen: '1h',
    company: 'Hospital Zambrano',
    assignedTo: 't1' // Assigned to Sofia
  },
  {
    id: 'c3',
    name: 'Luis Hernández',
    phone: '+52 81 8300 0000',
    email: 'luis.h@tec.mx',
    avatar: 'https://i.pravatar.cc/150?u=Luis',
    isVip: false,
    location: 'Tec de Monterrey',
    tags: ['Estudiante', 'Informes'],
    lastSeen: '3h',
    company: 'ITESM',
    assignedTo: 't3' // Assigned to Elena
  },
  {
    id: 'c4',
    name: 'Carla Serna',
    phone: '+52 81 9999 8888',
    email: 'carla.serna@gmail.com',
    avatar: 'https://i.pravatar.cc/150?u=Carla',
    isVip: true,
    location: 'Cumbres',
    tags: ['VIP', 'Recurrente'],
    lastSeen: 'Ayer',
    company: 'Freelance',
    assignedTo: 't2' // Assigned to Marcelo
  },
    {
    id: 'c5',
    name: 'Javier Montemayor',
    phone: '+52 81 7777 6666',
    email: 'javier.m@femsa.com',
    avatar: 'https://i.pravatar.cc/150?u=Javier',
    isVip: false,
    location: 'Centro',
    tags: ['Nuevo', 'Wholesale'],
    lastSeen: '5m',
    company: 'Femsa',
    assignedTo: 't2' // Assigned to Marcelo
  }
];

export const CONVERSATIONS: Conversation[] = [
  {
    id: 'conv1',
    contactId: 'c1',
    lastMessage: '¿Podemos reagendar la sesión para el jueves?',
    lastMessageTime: '09:41 AM',
    unreadCount: 2,
    priority: 'high',
    status: 'open',
    tags: ['Lead', 'Urgente'],
    platform: 'whatsapp',
    messages: [
        { id: 'm1', senderId: 'c1', text: '¡Hola! Me interesa el Plan Premium para mi equipo en San Pedro. ¿Tienen precios actualizados?', timestamp: '09:41 AM', type: 'text', status: 'read' },
        { id: 'm2', senderId: 'system', text: 'El cliente es un lead de alto valor del webinar reciente. Necesita seguimiento sobre integraciones API.', timestamp: '09:42 AM', type: 'note' },
        { id: 'm3', senderId: 'me', text: '¡Hola Roberto! Claro que sí. Para equipos en Monterrey ofrecemos un descuento especial. Te adjunto el PDF.', timestamp: '09:45 AM', type: 'text', status: 'read' },
        { id: 'm4', senderId: 'me', text: 'Propuesta_Empresarial_2024.pdf', timestamp: '09:45 AM', type: 'file', fileName: 'Propuesta_Empresarial_2024.pdf', fileSize: '1.2 MB', status: 'read' },
        { id: 'm5', senderId: 'c1', text: 'Perfecto. ¿Podemos tener una llamada rápida mañana?', timestamp: '09:48 AM', type: 'text', status: 'delivered' }
    ]
  },
  {
    id: 'conv2',
    contactId: 'c2',
    lastMessage: 'Ya envié los documentos por correo.',
    lastMessageTime: '10:15 AM',
    unreadCount: 0,
    priority: 'medium',
    status: 'open',
    tags: ['Docs'],
    platform: 'whatsapp',
    messages: [
         { id: 'm6', senderId: 'c2', text: 'Hola, ya te envié la constancia fiscal.', timestamp: '10:15 AM', type: 'text', status: 'read' }
    ]
  },
  {
    id: 'conv3',
    contactId: 'c3',
    lastMessage: 'Gracias por la rápida respuesta.',
    lastMessageTime: 'Ayer',
    unreadCount: 0,
    priority: 'low',
    status: 'resolved',
    tags: [],
    platform: 'whatsapp',
    messages: []
  }
];

export const APPOINTMENTS: Appointment[] = [
  {
    id: 'apt1',
    contactId: 'c1',
    date: '24 OCT',
    time: '10:00 AM',
    type: 'Video Call',
    status: 'confirmed'
  },
  {
    id: 'apt2',
    contactId: 'c2',
    date: '25 OCT',
    time: '11:30 AM',
    type: 'Visita Técnica',
    status: 'pending'
  },
  {
    id: 'apt3',
    contactId: 'c3',
    date: '26 OCT',
    time: '09:00 AM',
    type: 'Video Demo',
    status: 'cancelled'
  }
];

export const WHATSAPP_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'wt1',
    name: 'bienvenida_monterrey_v2',
    language: 'es_MX',
    category: 'MARKETING',
    status: 'APPROVED',
    components: [
      { type: 'HEADER', format: 'IMAGE' },
      { type: 'BODY', text: '¡Hola {{1}}! 👋 Bienvenido a SyncFlow Monterrey. \n\nGracias por tu interés en nuestros servicios. ¿Te gustaría agendar una demostración personalizada para tu negocio?' },
      { type: 'FOOTER', text: 'Responder STOP para baja' },
      { type: 'BUTTONS', buttons: [
          { type: 'QUICK_REPLY', text: 'Sí, agendar demo' },
          { type: 'QUICK_REPLY', text: 'Ver precios' }
        ] 
      }
    ]
  },
  {
    id: 'wt2',
    name: 'confirmacion_cita_tecnica',
    language: 'es_MX',
    category: 'UTILITY',
    status: 'APPROVED',
    components: [
      { type: 'HEADER', format: 'TEXT', text: 'Confirmación de Cita' },
      { type: 'BODY', text: 'Estimado/a {{1}}, tu visita técnica ha sido confirmada para el día {{2}} a las {{3}}. \n\nUn técnico de SyncFlow estará llegando a tu ubicación.' },
      { type: 'FOOTER', text: 'SyncFlow Support Team' },
      { type: 'BUTTONS', buttons: [
          { type: 'URL', text: 'Ver ubicación', url: 'https://maps.google.com' }
        ] 
      }
    ]
  },
  {
    id: 'wt3',
    name: 'promo_buen_fin_2024',
    language: 'es_MX',
    category: 'MARKETING',
    status: 'PENDING',
    components: [
      { type: 'HEADER', format: 'IMAGE' },
      { type: 'BODY', text: '¡El Buen Fin ya llegó a Monterrey! 🤠\n\nAprovecha un {{1}}% de descuento en tu primera anualidad. Oferta válida hasta el domingo.' },
      { type: 'BUTTONS', buttons: [
          { type: 'URL', text: 'Reclamar oferta', url: 'https://syncflow.mx/oferta' }
        ] 
      }
    ]
  },
  {
    id: 'wt4',
    name: 'alerta_pago_rechazado',
    language: 'es_MX',
    category: 'UTILITY',
    status: 'REJECTED',
    components: [
      { type: 'BODY', text: 'Tu pago de {{1}} fue rechazado. Paga ahora o cortaremos el servicio.' },
      { type: 'FOOTER', text: 'Evita problemas.' }
    ]
  }
];

export const CAMPAIGNS: Campaign[] = [
  {
    id: 'camp1',
    name: 'Promo Verano 2024',
    status: 'completed',
    sentDate: '15 JUN 2024',
    audienceSize: 1250,
    deliveredCount: 1200,
    readCount: 980,
    templateName: 'promo_verano_mty',
    tagFilter: 'Todos'
  },
  {
    id: 'camp2',
    name: 'Recordatorio Webinar API',
    status: 'completed',
    sentDate: '20 AGO 2024',
    audienceSize: 300,
    deliveredCount: 298,
    readCount: 150,
    templateName: 'webinar_invite_v1',
    tagFilter: 'Lead'
  },
  {
    id: 'camp3',
    name: 'Buen Fin - VIP Access',
    status: 'scheduled',
    audienceSize: 45,
    deliveredCount: 0,
    readCount: 0,
    templateName: 'vip_early_access',
    tagFilter: 'VIP'
  }
];