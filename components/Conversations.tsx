import React, { useState, useEffect } from 'react';
import {
  Search,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Send,
  StickyNote,
  Zap,
  CheckCheck,
  Check,
  Download,
  Ban,
  X,
  ChevronRight,
  MessageSquare,
  ArrowLeft,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Conversation, Contact, Message } from '../types';
import { useConversations } from '../hooks/useConversations';
import { useContacts } from '../hooks/useContacts';
import { useAuth } from './AuthContext';

// --- Templates Data ---
const TEMPLATE_CATEGORIES = ['Todos', 'Bienvenida', 'Ventas', 'Soporte', 'Cierre'];

const TEMPLATES = [
  { id: 't1', title: 'Bienvenida General', text: '¡Hola! 👋 Gracias por contactar a SyncFlow. ¿En qué podemos ayudarte el día de hoy?', category: 'Bienvenida' },
  { id: 't2', title: 'Ausencia Temporal', text: 'Hola, en este momento nuestros agentes están ocupados. Déjanos tu mensaje y te contactamos en breve.', category: 'Bienvenida' },
  { id: 't3', title: 'Envío de Portafolio', text: 'Claro que sí, te comparto nuestro catálogo de servicios actualizado en formato PDF. 📄', category: 'Ventas' },
  { id: 't4', title: 'Seguimiento de Cotización', text: 'Hola, ¿tuviste oportunidad de revisar la propuesta que te enviamos? Quedo atento a tus comentarios. 👍', category: 'Ventas' },
  { id: 't5', title: 'Solicitud de Datos', text: 'Para generar tu factura, ¿podrías compartirme tu Constancia de Situación Fiscal actualizada? 🧾', category: 'Soporte' },
  { id: 't7', title: 'Despedida Agradecida', text: '¡Gracias por tu confianza! Si necesitas algo más, aquí estamos a la orden. Que tengas excelente día. ☀️', category: 'Cierre' },
];

const StatusIcon = ({ status }: { status?: string }) => {
  if (status === 'read') return <CheckCheck className="w-3 h-3 text-blue-500" />;
  if (status === 'delivered') return <CheckCheck className="w-3 h-3 text-slate-400" />;
  if (status === 'sent') return <Check className="w-3 h-3 text-slate-400" />;
  if (status === 'failed') return <AlertCircle className="w-3 h-3 text-red-500" />;
  if (status === 'queued') return <Clock className="w-3 h-3 text-slate-300" />;
  return null;
}

const MessageBubble: React.FC<{ message: Message; contacts: Contact[]; currentUserId?: string }> = ({ message, contacts, currentUserId }) => {
  const isMe = message.senderId === 'me' || message.senderId === currentUserId;
  const isSystem = message.senderId === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center mx-auto max-w-[90%] mb-4">
        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-xl w-full">
          <div className="flex items-center gap-2 mb-1">
            <StickyNote className="w-4 h-4 text-yellow-600" />
            <p className="text-[10px] font-bold text-yellow-700 uppercase tracking-wider">Nota Interna</p>
          </div>
          <p className="text-sm text-yellow-800 italic">{message.text}</p>
        </div>
      </div>
    );
  }

  const sender = contacts.find(c => c.id === message.senderId);

  return (
    <div className={`flex gap-3 max-w-[85%] md:max-w-[80%] mb-4 ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
      {!isMe && (
        <img
          src={sender?.avatar || "https://i.pravatar.cc/150"}
          alt="Avatar"
          className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0"
        />
      )}

      <div className={`space-y-1 ${isMe ? 'items-end flex flex-col' : ''}`}>
        {message.type === 'file' ? (
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 w-64 max-w-full">
            <div className="bg-primary-50 p-2 rounded-lg">
              <StickyNote className="w-5 h-5 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate text-slate-900">{message.fileName}</p>
              <p className="text-[10px] text-slate-400">{message.fileSize} • PDF</p>
            </div>
            <button className="text-primary-600 hover:text-primary-700">
              <Download className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className={`p-3 rounded-2xl shadow-sm ${isMe
            ? 'bg-primary-600 text-white rounded-tr-none'
            : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
            }`}>
            <p className="text-sm leading-relaxed">{message.text}</p>
          </div>
        )}

        <div className="flex items-center gap-1 pr-1">
          <p className="text-[10px] text-slate-400">{message.timestamp}</p>
          {isMe && <StatusIcon status={message.status} />}
        </div>
      </div>
    </div>
  );
};

const Conversations = () => {
  const { user, loading: loadingAuth } = useAuth();
  const organizationId = user?.organizationId || '';

  const { conversations, loading: loadingConversations } = useConversations(organizationId);
  const { contacts, loading: loadingContacts } = useContacts(organizationId);

  const [selectedConvId, setSelectedConvId] = useState<string>('');
  const [inputText, setInputText] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  // Auto-select first conversation
  useEffect(() => {
    if (conversations.length > 0 && !selectedConvId) {
      setSelectedConvId(conversations[0].id);
    }
  }, [conversations, selectedConvId]);

  if (loadingAuth || loadingConversations || loadingContacts) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50">
        <div className="text-center p-8">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700">No hay conversaciones</h3>
          <p className="text-slate-500 text-sm">Tus mensajes aparecerán aquí.</p>
        </div>
      </div>
    );
  }

  const selectedConv = conversations.find(c => c.id === selectedConvId) || conversations[0];
  const contact = selectedConv ? contacts.find(c => c.id === selectedConv.contactId) : null;

  // Render loading state if strictly needed data is missing unexpectedly
  if (!selectedConv || !contact) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50">
        <div className="text-center text-slate-400">Selecciona una conversación</div>
      </div>
    );
  }

  const handleTemplateClick = (text: string) => {
    setInputText(text);
    setShowTemplates(false);
  };

  const handleSelectConversation = (id: string) => {
    setSelectedConvId(id);
    setIsMobileChatOpen(true);
  };

  const filteredTemplates = selectedCategory === 'Todos'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === selectedCategory);

  return (
    <div className="flex h-full bg-white relative">

      {/* Sidebar List (Inbox) */}
      <div className={`
        w-full md:w-80 border-r border-slate-200 flex flex-col flex-shrink-0 bg-white
        ${isMobileChatOpen ? 'hidden md:flex' : 'flex'}
      `}>
        <div className="p-4 space-y-3 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Bandeja de Entrada</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar chats..."
              className="w-full bg-slate-50 border-none rounded-xl pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary-100 placeholder:text-slate-400"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-bold shrink-0">Todos</button>
            <button className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold shrink-0 hover:bg-slate-200">No Leídos</button>
            <button className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold shrink-0 hover:bg-slate-200">Prioridad</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {conversations.map(conv => {
            const c = contacts.find(ct => ct.id === conv.contactId);
            const isSelected = selectedConvId === conv.id;
            return (
              <div
                key={conv.id}
                onClick={() => handleSelectConversation(conv.id)}
                className={`flex items-center gap-3 px-4 py-4 cursor-pointer border-b border-slate-50 transition-colors ${isSelected ? 'bg-primary-50 border-l-4 border-l-primary-600' : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                  }`}
              >
                <div className="relative shrink-0">
                  <img src={c?.avatar || "https://i.pravatar.cc/150"} alt={c?.name} className="w-12 h-12 rounded-full bg-slate-200 object-cover" />
                  {conv.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 rounded-full text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                      {conv.unreadCount}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <p className={`text-sm truncate ${isSelected ? 'font-bold text-primary-900' : 'font-semibold text-slate-900'}`}>
                      {c?.name || 'Desconocido'}
                    </p>
                    <span className="text-[10px] text-slate-400">{conv.lastMessageTime}</span>
                  </div>
                  <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'font-bold text-slate-800' : 'text-slate-500'}`}>
                    {conv.lastMessage}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`
        flex-1 flex flex-col bg-[#f0f2f5] relative
        ${isMobileChatOpen ? 'flex' : 'hidden md:flex'}
      `}>
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileChatOpen(false)}
              className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <img src={contact.avatar || "https://i.pravatar.cc/150"} alt={contact.name} className="w-8 h-8 rounded-full md:hidden" />
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                {contact.name || 'Desconocido'}
                {contact.isVip && <span className="hidden md:inline-block bg-amber-100 text-amber-700 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">VIP</span>}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium truncate max-w-[150px] md:max-w-none">WhatsApp Business • {contact.location || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-slate-50 rounded-lg transition-colors hidden md:block">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-slate-50 rounded-lg transition-colors hidden md:block">
              <Video className="w-5 h-5" />
            </button>
            <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block"></div>
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar"
          style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}
        >
          <div className="flex justify-center mb-6">
            <span className="bg-slate-200 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">Hoy</span>
          </div>
          {selectedConv.messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} contacts={contacts} currentUserId={user?.id} />
          ))}
        </div>

        {/* Templates Popover */}
        {showTemplates && (
          <div className="absolute bottom-20 left-2 right-2 md:left-12 md:w-[500px] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-20 animate-in slide-in-from-bottom-5 duration-200">
            <div className="bg-slate-50 border-b border-slate-100 p-3 flex justify-between items-center">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                Plantillas Rápidas
              </h4>
              <button onClick={() => setShowTemplates(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex overflow-x-auto p-2 gap-2 border-b border-slate-50 no-scrollbar">
              {TEMPLATE_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${selectedCategory === cat
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-slate-500 hover:bg-slate-50'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="max-h-60 overflow-y-auto p-2 custom-scrollbar">
              {filteredTemplates.map(template => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateClick(template.text)}
                  className="w-full text-left p-3 hover:bg-slate-50 rounded-xl transition-colors group flex items-start gap-3"
                >
                  <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">
                    <MessageSquare className="w-4 h-4 text-slate-400 group-hover:text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 mb-0.5">{template.title}</p>
                    <p className="text-xs text-slate-500 line-clamp-2">{template.text}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 ml-auto self-center opacity-0 group-hover:opacity-100" />
                </button>
              ))}
              {filteredTemplates.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No hay plantillas en esta categoría.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-3 md:p-4 bg-white border-t border-slate-200 z-10">
          <div className="max-w-4xl mx-auto flex gap-2">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className={`p-2 rounded-lg transition-colors ${showTemplates ? 'bg-amber-100 text-amber-600' : 'text-slate-400 hover:bg-slate-100'}`}
              title="Plantillas"
            >
              <Zap className={`w-5 h-5 ${showTemplates ? 'fill-amber-600' : ''}`} />
            </button>
            <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors hidden md:block" title="Adjuntar">
              <Paperclip className="w-5 h-5" />
            </button>
            <div className="flex-1 bg-slate-100 rounded-xl flex items-center px-4">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3 text-slate-800 placeholder:text-slate-400"
              />
            </div>
            <button className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 shadow-md shadow-primary-200 transition-all">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Detail Panel (Desktop Only) */}
      <div className="w-80 bg-white border-l border-slate-200 hidden xl:flex flex-col overflow-y-auto custom-scrollbar">
        <div className="p-8 flex flex-col items-center text-center border-b border-slate-100">
          <img src={contact.avatar || "https://i.pravatar.cc/150"} alt={contact.name} className="w-24 h-24 rounded-full p-1 border-4 border-primary-50 mb-4 object-cover" />
          <h4 className="text-lg font-bold text-slate-900">{contact.name}</h4>
          <p className="text-sm text-slate-500 font-medium mt-1">{contact.phone}</p>
          <p className="text-xs text-slate-400 mt-1">{contact.email}</p>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Etiquetas</label>
            <div className="flex flex-wrap gap-2">
              {contact.tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 bg-primary-50 text-primary-700 text-[10px] font-bold rounded-lg border border-primary-100">
                  #{tag}
                </span>
              ))}
              <button className="text-[10px] text-primary-600 font-bold hover:underline px-1">+ Agregar</button>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Estado del Chat</label>
            <select className="w-full bg-slate-50 border-none rounded-lg text-sm font-semibold py-2.5 px-3 focus:ring-2 focus:ring-primary-100 text-slate-700">
              <option value="open">Abierto</option>
              <option value="pending">Pendiente</option>
              <option value="closed">Cerrado</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 hover:border-red-100 transition-colors">
              <Ban className="w-4 h-4" />
              Bloquear Contacto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversations;