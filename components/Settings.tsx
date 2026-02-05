import React, { useState, useEffect } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Smartphone, 
  Globe, 
  Save, 
  Eye, 
  EyeOff, 
  Copy, 
  FileText, 
  Search, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  Image as ImageIcon,
  MessageSquare,
  X,
  Info
} from 'lucide-react';
import { CURRENT_USER, WHATSAPP_TEMPLATES } from '../mockData';
import { WhatsAppTemplate, WhatsAppTemplateComponent } from '../types';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('templates'); 
  const [showToken, setShowToken] = useState(false);
  
  // Safe State Initialization
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [newTemplateForm, setNewTemplateForm] = useState({
    name: '',
    category: 'MARKETING',
    language: 'es_MX',
    headerText: '',
    bodyText: '',
    footerText: ''
  });

  // Load templates safely
  useEffect(() => {
    if (WHATSAPP_TEMPLATES && WHATSAPP_TEMPLATES.length > 0) {
      setTemplates(WHATSAPP_TEMPLATES);
      setSelectedTemplate(WHATSAPP_TEMPLATES[0]);
    }
  }, []);

  const handleCreateTemplate = () => {
    if (!newTemplateForm.name || !newTemplateForm.bodyText) return;

    // Simulate API Call to Meta
    const newTemplate: WhatsAppTemplate = {
      id: `wt_new_${Date.now()}`,
      name: newTemplateForm.name.toLowerCase().replace(/\s+/g, '_'),
      language: newTemplateForm.language,
      category: newTemplateForm.category as any,
      status: 'PENDING', // Meta always starts as PENDING
      components: [
        { type: 'BODY', text: newTemplateForm.bodyText },
        ...(newTemplateForm.headerText ? [{ type: 'HEADER', format: 'TEXT', text: newTemplateForm.headerText } as WhatsAppTemplateComponent] : []),
        ...(newTemplateForm.footerText ? [{ type: 'FOOTER', text: newTemplateForm.footerText } as WhatsAppTemplateComponent] : [])
      ]
    };

    setTemplates([newTemplate, ...templates]);
    setSelectedTemplate(newTemplate);
    setIsCreating(false);
    
    // Reset form
    setNewTemplateForm({
      name: '',
      category: 'MARKETING',
      language: 'es_MX',
      headerText: '',
      bodyText: '',
      footerText: ''
    });

    // Simulate system alert
    alert(`✅ Plantilla enviada a Meta.\n\nID: ${newTemplate.id}\nEstado: PENDING\n\nRecibirás un webhook cuando sea aprobada.`);
  };

  const tabs = [
    { id: 'profile', label: 'Mi Perfil', icon: User },
    { id: 'integrations', label: 'Integraciones', icon: Smartphone },
    { id: 'templates', label: 'Plantillas WA', icon: FileText },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'security', label: 'Seguridad', icon: Shield },
  ];

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'APPROVED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'APPROVED': return <CheckCircle2 className="w-3 h-3" />;
      case 'PENDING': return <Clock className="w-3 h-3" />;
      case 'REJECTED': return <AlertCircle className="w-3 h-3" />;
      default: return null;
    }
  };

  // Safe accessor for preview (handles both existing and creating states)
  const getPreviewComponent = (type: string) => {
    if (isCreating) {
       if (type === 'HEADER' && newTemplateForm.headerText) return { type: 'HEADER', format: 'TEXT', text: newTemplateForm.headerText };
       if (type === 'BODY') return { type: 'BODY', text: newTemplateForm.bodyText || 'Escribe tu mensaje...' };
       if (type === 'FOOTER' && newTemplateForm.footerText) return { type: 'FOOTER', text: newTemplateForm.footerText };
       return null;
    }

    if (!selectedTemplate) return null;
    if (!selectedTemplate.components) return null;
    return selectedTemplate.components.find(c => c.type === type);
  }

  // Safe accessor specifically for buttons
  const getButtons = () => {
    if (isCreating) return []; // Simplification for demo
    const btnComponent = getPreviewComponent('BUTTONS');
    if (btnComponent && Array.isArray((btnComponent as any).buttons)) {
        return (btnComponent as any).buttons;
    }
    return [];
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="max-w-[1200px] mx-auto p-4 md:p-8 animate-in fade-in duration-500 pb-20">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Configuración</h1>
        <p className="text-slate-500 mb-8">Administra tu cuenta, integraciones y plantillas de mensajes.</p>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="w-full lg:w-64 flex-shrink-0 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-2 lg:pb-0">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 lg:w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
                    isActive 
                      ? 'bg-white text-primary-600 shadow-sm border border-slate-100 font-bold' 
                      : 'text-slate-500 hover:bg-white/50 hover:text-slate-700 font-medium'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-slate-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
            
            {/* --- TEMPLATES TAB --- */}
            {activeTab === 'templates' && (
              <div className="flex flex-col h-full">
                {/* Templates Header */}
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Plantillas de Mensajes</h2>
                    <p className="text-xs text-slate-500">Sincronizado con Meta Business Manager.</p>
                  </div>
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Buscar plantilla..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary-100"
                      />
                    </div>
                    <button 
                      onClick={() => { setIsCreating(true); setSelectedTemplate(null); }}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Crear
                    </button>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row h-full">
                  {/* Left: List */}
                  <div className="w-full md:w-1/2 border-r border-slate-100 overflow-y-auto custom-scrollbar h-[600px]">
                    {isCreating ? (
                      <div className="p-6 space-y-4">
                         <div className="flex items-center justify-between mb-2">
                           <h3 className="font-bold text-slate-900">Nueva Plantilla</h3>
                           <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                         </div>
                         
                         <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex gap-2 items-start">
                            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-blue-800 leading-tight">
                              Al hacer clic en "Enviar", la plantilla se mandará a Meta para revisión (aprox. 1 min a 24 hrs).
                            </p>
                         </div>

                         <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre (sistema)</label>
                           <input 
                              type="text" 
                              value={newTemplateForm.name}
                              onChange={(e) => setNewTemplateForm({...newTemplateForm, name: e.target.value})}
                              placeholder="ej: bienvenida_cliente_nuevo" 
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono" 
                            />
                           <p className="text-[10px] text-slate-400 mt-1">Solo minúsculas y guiones bajos.</p>
                         </div>

                         <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Categoría</label>
                              <select 
                                value={newTemplateForm.category}
                                onChange={(e) => setNewTemplateForm({...newTemplateForm, category: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm"
                              >
                                <option value="MARKETING">Marketing</option>
                                <option value="UTILITY">Utilidad</option>
                                <option value="AUTHENTICATION">Autenticación</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Idioma</label>
                              <select 
                                value={newTemplateForm.language}
                                onChange={(e) => setNewTemplateForm({...newTemplateForm, language: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm"
                              >
                                <option value="es_MX">Español (México)</option>
                                <option value="en_US">Inglés (US)</option>
                              </select>
                            </div>
                         </div>

                         <div className="border-t border-slate-100 pt-4">
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Encabezado (Texto)</label>
                           <input 
                              type="text" 
                              value={newTemplateForm.headerText}
                              onChange={(e) => setNewTemplateForm({...newTemplateForm, headerText: e.target.value})}
                              placeholder="Ej: Confirmación de Cita" 
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" 
                            />
                         </div>

                         <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cuerpo del Mensaje</label>
                           <textarea 
                              rows={5} 
                              value={newTemplateForm.bodyText}
                              onChange={(e) => setNewTemplateForm({...newTemplateForm, bodyText: e.target.value})}
                              placeholder="Escribe tu mensaje aquí. Usa {{1}} para variables." 
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium" 
                            />
                         </div>

                         <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pie de página (Opcional)</label>
                           <input 
                              type="text" 
                              value={newTemplateForm.footerText}
                              onChange={(e) => setNewTemplateForm({...newTemplateForm, footerText: e.target.value})}
                              placeholder="Texto pequeño gris" 
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" 
                            />
                         </div>

                         <div className="pt-4">
                           <button 
                            onClick={handleCreateTemplate}
                            disabled={!newTemplateForm.name || !newTemplateForm.bodyText}
                            className="w-full bg-primary-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                           >
                             Enviar a Revisión (API)
                           </button>
                         </div>
                      </div>
                    ) : (
                      filteredTemplates.map(template => (
                        <div 
                          key={template.id}
                          onClick={() => setSelectedTemplate(template)}
                          className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${selectedTemplate?.id === template.id ? 'bg-primary-50 border-l-4 border-l-primary-600' : 'border-l-4 border-l-transparent'}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-slate-800 text-sm">{template.name}</h3>
                            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(template.status)}`}>
                              {getStatusIcon(template.status)}
                              {template.status}
                            </span>
                          </div>
                          <div className="flex gap-2 mb-2">
                             <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono">{template.language}</span>
                             <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono">{template.category}</span>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-2">
                            {template.components.find(c => c.type === 'BODY')?.text || 'Sin texto'}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Right: Preview (Phone Mockup) */}
                  <div className="w-full md:w-1/2 bg-slate-50 p-6 flex flex-col items-center justify-center border-l border-slate-200 h-[600px] overflow-hidden">
                     {selectedTemplate || isCreating ? (
                       <div className="w-[280px] bg-white rounded-[30px] border-[8px] border-slate-800 shadow-2xl overflow-hidden relative h-[520px] flex flex-col animate-in zoom-in-95 duration-300">
                          {/* Phone Notch */}
                          <div className="bg-slate-800 h-6 w-32 mx-auto rounded-b-xl absolute top-0 left-1/2 -translate-x-1/2 z-10"></div>
                          
                          {/* Phone Header */}
                          <div className="bg-[#075e54] h-16 w-full flex items-end p-3 gap-2 text-white shrink-0">
                             <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"><User className="w-5 h-5" /></div>
                             <div className="pb-1">
                               <p className="text-xs font-bold leading-none">SyncFlow</p>
                               <p className="text-[9px] opacity-80">Cuenta de empresa</p>
                             </div>
                          </div>

                          {/* Phone Body (Chat) */}
                          <div className="flex-1 bg-[#e5ddd5] p-3 overflow-y-auto font-sans relative">
                              <div className="bg-white rounded-lg rounded-tl-none p-1 shadow-sm max-w-[90%] text-sm text-slate-800 relative mb-2">
                                {/* Header Component */}
                                {getPreviewComponent('HEADER') && (
                                   <div className="mb-2 rounded overflow-hidden">
                                     {(getPreviewComponent('HEADER') as any).format === 'IMAGE' ? (
                                       <div className="h-24 bg-slate-200 flex items-center justify-center text-slate-400">
                                         <ImageIcon className="w-8 h-8" />
                                       </div>
                                     ) : (
                                       <p className="font-bold px-2 pt-2">{(getPreviewComponent('HEADER') as any).text}</p>
                                     )}
                                   </div>
                                )}

                                {/* Body Component */}
                                <p className="px-2 whitespace-pre-line text-[13px] leading-snug">
                                  {((getPreviewComponent('BODY') as any)?.text || '').replace(/{{(\d+)}}/g, (match: string) => `[${match.replace(/{{|}}/g, '')}]`)}
                                </p>

                                {/* Footer Component */}
                                {getPreviewComponent('FOOTER') && (
                                   <p className="px-2 pt-1 pb-1 text-[10px] text-slate-400">
                                     {(getPreviewComponent('FOOTER') as any).text}
                                   </p>
                                )}
                                
                                {/* Time */}
                                <span className="absolute bottom-1 right-2 text-[9px] text-slate-400">10:30 AM</span>
                              </div>

                              {/* Buttons Component */}
                              {getButtons().length > 0 && (
                                <div className="space-y-1">
                                  {getButtons().map((btn: any, idx: number) => (
                                    <div key={idx} className="bg-white text-primary-600 text-center py-2 rounded shadow-sm text-xs font-bold cursor-pointer hover:bg-slate-50 flex items-center justify-center gap-1">
                                       {btn.type === 'URL' && <Globe className="w-3 h-3" />}
                                       {btn.type === 'PHONE_NUMBER' && <Smartphone className="w-3 h-3" />}
                                       {btn.type === 'QUICK_REPLY' && <MessageSquare className="w-3 h-3" />}
                                       {btn.text}
                                    </div>
                                  ))}
                                </div>
                              )}
                          </div>
                       </div>
                     ) : (
                       <div className="text-center text-slate-400">
                         <FileText className="w-12 h-12 mx-auto mb-2 opacity-20" />
                         <p className="text-sm">Selecciona una plantilla para ver la vista previa.</p>
                       </div>
                     )}
                     <div className="mt-4 text-center">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                          {isCreating ? 'Vista Previa (Edición)' : 'Vista Previa (Oficial)'}
                        </p>
                     </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                  <img src={CURRENT_USER.avatar} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-slate-50 object-cover" />
                  <div>
                    <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
                      Cambiar Foto
                    </button>
                    <p className="text-xs text-slate-400 mt-2">JPG, GIF o PNG. Max 1MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nombre Completo</label>
                    <input type="text" defaultValue={CURRENT_USER.name} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-primary-100 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Rol / Puesto</label>
                    <input type="text" defaultValue={CURRENT_USER.role} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 cursor-not-allowed" disabled />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Correo Electrónico</label>
                    <input type="email" defaultValue="alex.rivera@syncflow.mx" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-primary-100 outline-none transition-all" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Bio</label>
                    <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary-100 outline-none transition-all h-24" placeholder="Escribe algo sobre ti..."></textarea>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button className="px-6 py-2 bg-primary-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all flex items-center gap-2">
                     <Save className="w-4 h-4" /> Guardar Perfil
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="p-8 space-y-6">
                <h3 className="text-lg font-bold text-slate-900">Preferencias de Alertas</h3>
                {[
                  { title: 'Nuevos Mensajes', desc: 'Recibir notificaciones cuando llegue un mensaje nuevo.' },
                  { title: 'Actualizaciones del Sistema', desc: 'Noticias sobre nuevas funcionalidades de SyncFlow.' },
                  { title: 'Sonidos', desc: 'Reproducir sonido al recibir notificaciones.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{item.title}</p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={idx < 1} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="p-8 space-y-6">
                  <div className="p-4 border border-emerald-100 bg-emerald-50 rounded-xl flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">WA</div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">WhatsApp Business API</p>
                        <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">● Conectado (Cloud API)</p>
                      </div>
                    </div>
                    <button className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg">Ver Documentación</button>
                  </div>

                  <div className="space-y-4">
                     <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">Credenciales de Meta</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number ID</label>
                          <input type="text" placeholder="1092..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:ring-2 focus:ring-primary-100 outline-none transition-all" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">WABA ID</label>
                          <input type="text" placeholder="1055..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:ring-2 focus:ring-primary-100 outline-none transition-all" />
                        </div>
                        <div className="md:col-span-2">
                           <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Permanent Access Token</label>
                           <div className="relative">
                              <input 
                                type={showToken ? "text" : "password"} 
                                placeholder="EAA..." 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-mono focus:ring-2 focus:ring-primary-100 outline-none transition-all" 
                              />
                              <button 
                                onClick={() => setShowToken(!showToken)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                              >
                                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                           </div>
                           <p className="text-[10px] text-slate-400 mt-1">Este token no expira. Generado en la configuración de usuario del sistema.</p>
                        </div>
                     </div>
                  </div>

                  <div className="bg-slate-900 text-slate-200 p-4 rounded-xl space-y-3 mt-4">
                     <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-4 h-4 text-primary-400" />
                        <h4 className="text-sm font-bold text-white">Configuración de Webhook</h4>
                     </div>
                     <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Callback URL</p>
                        <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-lg border border-slate-700">
                           <code className="text-xs font-mono text-emerald-400 flex-1 truncate">https://api.syncflow.mx/webhook/whatsapp</code>
                           <button className="text-slate-400 hover:text-white"><Copy className="w-3.5 h-3.5" /></button>
                        </div>
                     </div>
                     <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Verify Token</p>
                        <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-lg border border-slate-700">
                           <code className="text-xs font-mono text-white flex-1">syncflow_secure_v1</code>
                           <button className="text-slate-400 hover:text-white"><Copy className="w-3.5 h-3.5" /></button>
                        </div>
                     </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <button className="px-6 py-2 bg-primary-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all flex items-center gap-2">
                       <Save className="w-4 h-4" /> Guardar Integración
                    </button>
                  </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;