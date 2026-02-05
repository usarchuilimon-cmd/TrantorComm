import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Star, 
  Filter, 
  Plus, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  MoreHorizontal, 
  Phone, 
  Mail,
  Trash2,
  Edit2,
  X,
  Save,
  User,
  Building2,
  MapPin,
  Tag,
  Briefcase
} from 'lucide-react';
import { CONTACTS, TEAM_MEMBERS, CURRENT_USER } from '../mockData';
import { Contact } from '../types';

const Contacts = () => {
  // Data State
  const [contactsList, setContactsList] = useState<Contact[]>(CONTACTS);
  const ALL_AGENTS = [CURRENT_USER, ...TEAM_MEMBERS];
  
  // Filter & Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: 'name' | 'phone'; direction: 'asc' | 'desc' } | null>(null);
  const [onlyVip, setOnlyVip] = useState(false);

  // UI Actions State
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State
  const emptyContact: Contact = {
    id: '',
    name: '',
    phone: '',
    email: '',
    avatar: 'https://i.pravatar.cc/150?u=default',
    isVip: false,
    location: '',
    tags: [],
    lastSeen: 'Ahora',
    company: '',
    assignedTo: CURRENT_USER.id
  };
  const [formData, setFormData] = useState<Contact>(emptyContact);
  const [tagInput, setTagInput] = useState('');

  // --- Handlers ---

  const handleOpenCreate = () => {
    setFormData({ ...emptyContact, id: `new_${Date.now()}` });
    setIsEditing(false);
    setIsModalOpen(true);
    setActiveActionId(null);
  };

  const handleOpenEdit = (contact: Contact) => {
    setFormData({ ...contact });
    setIsEditing(true);
    setIsModalOpen(true);
    setActiveActionId(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este contacto?')) {
      setContactsList(prev => prev.filter(c => c.id !== id));
      setActiveActionId(null);
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.phone) {
      alert('Por favor completa el nombre y el teléfono.');
      return;
    }

    if (isEditing) {
      setContactsList(prev => prev.map(c => c.id === formData.id ? formData : c));
    } else {
      const newContact = { 
        ...formData, 
        avatar: `https://i.pravatar.cc/150?u=${formData.name.replace(' ', '')}` 
      };
      setContactsList(prev => [newContact, ...prev]);
    }
    setIsModalOpen(false);
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
  };

  const getAgentInfo = (userId?: string) => {
    const agent = ALL_AGENTS.find(u => u.id === userId);
    return agent || { name: 'Sin Asignar', avatar: '', role: '', id: '' };
  };

  // Sorting Handler
  const requestSort = (key: 'name' | 'phone') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter & Sort Logic
  const processedContacts = useMemo(() => {
    let data = [...contactsList];

    // 1. Filter by Search
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      data = data.filter(c => 
        c.name.toLowerCase().includes(lower) || 
        c.email.toLowerCase().includes(lower) ||
        c.phone.includes(lower) ||
        c.company?.toLowerCase().includes(lower)
      );
    }

    // 2. Filter by VIP
    if (onlyVip) {
      data = data.filter(c => c.isVip);
    }

    // 3. Sort
    if (sortConfig) {
      data.sort((a, b) => {
        const valA = (a[sortConfig.key] || '').toLowerCase();
        const valB = (b[sortConfig.key] || '').toLowerCase();

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [contactsList, searchTerm, sortConfig, onlyVip]);

  // Helper for Icons
  const getSortIcon = (key: 'name' | 'phone') => {
    if (sortConfig?.key !== key) return <ArrowUpDown className="w-4 h-4 text-slate-300 opacity-50 group-hover:opacity-100" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="w-4 h-4 text-primary-600" /> 
      : <ArrowDown className="w-4 h-4 text-primary-600" />;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 h-full custom-scrollbar relative">
      
      {/* Header Controls */}
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Directorio de Contactos</h1>
            <p className="text-slate-500 text-sm">Gestiona tus clientes y proveedores en Monterrey.</p>
          </div>
          <button 
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-primary-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all w-full md:w-auto justify-center"
          >
             <Plus className="w-4 h-4" /> Nuevo Contacto
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mt-2">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors w-5 h-5" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, teléfono, email o empresa..." 
              className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
            />
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
             <button 
              onClick={() => setOnlyVip(!onlyVip)}
              className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 border transition-all whitespace-nowrap ${
                onlyVip 
                  ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
               <Star className={`w-4 h-4 ${onlyVip ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} /> 
               {onlyVip ? 'Viendo VIP' : 'Solo VIP'}
            </button>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-600 flex items-center gap-2 hover:border-primary-500 shadow-sm transition-all whitespace-nowrap">
               <Filter className="w-4 h-4" /> Más Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Table View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-20 min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th 
                  className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors group select-none"
                  onClick={() => requestSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Contacto
                    {getSortIcon('name')}
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors group select-none"
                  onClick={() => requestSort('phone')}
                >
                  <div className="flex items-center gap-2">
                    Teléfono / Email
                    {getSortIcon('phone')}
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ubicación & Empresa</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Agente</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Etiquetas</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {processedContacts.length > 0 ? (
                processedContacts.map(contact => {
                  const agent = getAgentInfo(contact.assignedTo);
                  return (
                  <tr key={contact.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                          {contact.isVip && (
                            <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                               <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{contact.name}</p>
                          <p className="text-xs text-slate-400">Último contacto: {contact.lastSeen}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {contact.phone}
                        </div>
                         <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {contact.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{contact.company || '—'}</p>
                        <p className="text-xs text-slate-500">{contact.location || 'Monterrey, NL'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {agent.id ? (
                        <div className="flex items-center gap-2">
                          <img src={agent.avatar} alt={agent.name} className="w-6 h-6 rounded-full border border-white shadow-sm" />
                          <span className="text-xs font-medium text-slate-700">{agent.name.split(' ')[0]}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Sin asignar</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {contact.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-tight">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveActionId(activeActionId === contact.id ? null : contact.id);
                        }}
                        className={`p-2 rounded-lg transition-colors ${activeActionId === contact.id ? 'bg-primary-50 text-primary-600' : 'text-slate-400 hover:text-primary-600 hover:bg-white'}`}
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeActionId === contact.id && (
                        <div className="absolute right-8 top-12 z-20 w-40 bg-white rounded-xl shadow-xl border border-slate-100 py-1 animate-in zoom-in-95 duration-100">
                          <button 
                            onClick={() => handleOpenEdit(contact)}
                            className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Edit2 className="w-3.5 h-3.5" /> Editar
                          </button>
                          <button 
                            onClick={() => handleDelete(contact.id)}
                            className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Eliminar
                          </button>
                        </div>
                      )}
                      
                      {/* Backdrop for dropdown */}
                      {activeActionId === contact.id && (
                        <div className="fixed inset-0 z-10 cursor-default" onClick={() => setActiveActionId(null)} />
                      )}
                    </td>
                  </tr>
                )})
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Search className="w-12 h-12 mb-3 opacity-20" />
                      <p className="text-sm font-medium">No se encontraron contactos</p>
                      <p className="text-xs">Intenta ajustar tus filtros de búsqueda</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer Pagination (Mock) */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">
            Mostrando <span className="font-bold text-slate-900">{processedContacts.length}</span> de <span className="font-bold text-slate-900">{contactsList.length}</span> contactos
          </p>
          <div className="flex gap-2">
            <button disabled className="px-3 py-1 text-xs font-bold text-slate-400 bg-white border border-slate-200 rounded-lg opacity-50 cursor-not-allowed">Anterior</button>
            <button className="px-3 py-1 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:border-primary-500 transition-colors">Siguiente</button>
          </div>
        </div>
      </div>

      {/* --- CRUD MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          ></div>
          
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
               <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                 {isEditing ? <Edit2 className="w-5 h-5 text-primary-600" /> : <Plus className="w-5 h-5 text-primary-600" />}
                 {isEditing ? 'Editar Contacto' : 'Nuevo Contacto'}
               </h2>
               <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                 <X className="w-5 h-5" />
               </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[70vh] custom-scrollbar space-y-4">
               
               {/* Main Fields */}
               <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre Completo <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary-100 outline-none"
                        placeholder="Ej. Roberto Cantú"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Teléfono <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary-100 outline-none"
                          placeholder="+52..."
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                      <div className="relative">
                         <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                         <input 
                          type="email" 
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary-100 outline-none"
                          placeholder="correo@empresa.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Agent Assignment Dropdown */}
                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Agente Asignado</label>
                     <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                          value={formData.assignedTo || ''}
                          onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary-100 outline-none appearance-none"
                        >
                          <option value="">Sin Asignar</option>
                          {ALL_AGENTS.map(agent => (
                            <option key={agent.id} value={agent.id}>
                               {agent.name} {agent.id === CURRENT_USER.id ? '(Tú)' : ''} - {agent.role}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                           <ArrowDown className="w-3 h-3 text-slate-400" />
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Empresa</label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="text" 
                            value={formData.company}
                            onChange={e => setFormData({...formData, company: e.target.value})}
                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary-100 outline-none"
                            placeholder="Nombre Negocio"
                          />
                        </div>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ubicación</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="text" 
                            value={formData.location}
                            onChange={e => setFormData({...formData, location: e.target.value})}
                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary-100 outline-none"
                            placeholder="Ciudad / Zona"
                          />
                        </div>
                     </div>
                  </div>

                  {/* VIP Toggle */}
                  <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100 cursor-pointer" onClick={() => setFormData({...formData, isVip: !formData.isVip})}>
                     <div className={`w-10 h-6 rounded-full p-1 transition-colors relative ${formData.isVip ? 'bg-amber-500' : 'bg-slate-300'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${formData.isVip ? 'translate-x-4' : 'translate-x-0'}`}></div>
                     </div>
                     <div>
                        <p className="text-sm font-bold text-slate-900 flex items-center gap-1">
                          Cliente VIP <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        </p>
                        <p className="text-[10px] text-slate-500">Recibirá atención prioritaria en el sistema.</p>
                     </div>
                  </div>

                  {/* Tags Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Etiquetas</label>
                    <div className="flex gap-2 mb-2 flex-wrap">
                      {formData.tags.map(tag => (
                        <span key={tag} className="bg-primary-50 text-primary-700 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                          #{tag}
                          <button onClick={() => removeTag(tag)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                       <input 
                          type="text" 
                          value={tagInput}
                          onChange={e => setTagInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && addTag()}
                          placeholder="Añadir etiqueta..."
                          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-primary-300"
                       />
                       <button onClick={addTag} className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-2 rounded-lg font-bold text-xs">
                         <Plus className="w-4 h-4" />
                       </button>
                    </div>
                  </div>

               </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-end gap-3">
               <button 
                 onClick={() => setIsModalOpen(false)}
                 className="px-5 py-2.5 text-slate-500 font-bold text-sm hover:bg-slate-200 rounded-xl transition-colors"
               >
                 Cancelar
               </button>
               <button 
                 onClick={handleSave}
                 className="px-6 py-2.5 bg-primary-600 text-white font-bold text-sm rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-200 transition-colors flex items-center gap-2"
               >
                 <Save className="w-4 h-4" />
                 {isEditing ? 'Guardar Cambios' : 'Crear Contacto'}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;