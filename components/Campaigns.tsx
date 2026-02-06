import React, { useState } from 'react';
import {
  Plus,
  Send,
  Calendar,
  Users,
  CheckCircle2,
  BarChart,
  ArrowRight,
  Filter,
  Eye,
  Smartphone
} from 'lucide-react';
import { Campaign } from '../types';
import { useContacts } from '../hooks/useContacts';
import { useCampaigns } from '../hooks/useCampaigns';
import { useTemplates } from '../hooks/useTemplates';
import { useAuth } from './AuthContext';
import { supabase } from '../supabaseClient';

const Campaigns = () => {
  const { user } = useAuth();
  const [view, setView] = useState<'list' | 'create'>('list');
  const [step, setStep] = useState(1);

  // Real Data Hooks
  const { contacts } = useContacts(user?.organizationId || '');
  const { campaigns, loading: loadingCampaigns } = useCampaigns(user?.organizationId || '');
  const { templates, loading: loadingTemplates } = useTemplates(user?.organizationId || '');

  // New Campaign State
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    tagFilter: 'Todos',
    templateId: '',
    scheduled: false,
    scheduledDate: ''
  });

  const uniqueTags = ['Todos', ...Array.from(new Set(contacts.flatMap(c => c.tags)))];

  const estimatedAudience = newCampaign.tagFilter === 'Todos'
    ? contacts.length
    : contacts.filter(c => c.tags.includes(newCampaign.tagFilter)).length;

  const selectedTemplate = templates.find(t => t.id === newCampaign.templateId);

  const handleCreate = async () => {
    if (!newCampaign.name || !newCampaign.templateId || !user?.organizationId) return;

    try {
      const payload = {
        organization_id: user.organizationId,
        name: newCampaign.name,
        status: newCampaign.scheduled ? 'scheduled' : 'running',
        sent_date: newCampaign.scheduled ? new new Date(newCampaign.scheduledDate).toISOString() : new Date().toISOString(),
        audience_size: estimatedAudience,
        delivered_count: 0,
        read_count: 0,
        template_name: selectedTemplate?.name || 'Desconocido',
        tag_filter: newCampaign.tagFilter
      };

      // Create fake ID for optimistic UI or just let subscription handle it. 
      // We'll insert to DB.
      const { error } = await supabase.from('comm_campaigns').insert({ ...payload, id: `camp_${Date.now()}` }); // ID is text in schema? Schema says id text primary key? check seed. Yes.

      if (error) throw error;

      if (!newCampaign.scheduled) {
        alert(`🚀 Campaña iniciada para ${estimatedAudience} contactos.`);
      } else {
        alert('📅 Campaña programada exitosamente.');
      }

      setView('list');
      setStep(1);
      setNewCampaign({ name: '', tagFilter: 'Todos', templateId: '', scheduled: false, scheduledDate: '' });

    } catch (err) {
      console.error(err);
      alert('Error al crear campaña');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-bold uppercase">Completada</span>;
      case 'running': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-bold uppercase animate-pulse">Enviando</span>;
      case 'scheduled': return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-xs font-bold uppercase">Programada</span>;
      default: return null;
    }
  };

  // --- Render Create Wizard ---
  if (view === 'create') {
    return (
      <div className="h-full overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-slate-50 border-b border-slate-200 p-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Nueva Campaña</h2>
              <p className="text-sm text-slate-500">Paso {step} de 3</p>
            </div>
            <div className="flex gap-2">
              <div className={`h-2 w-12 rounded-full ${step >= 1 ? 'bg-primary-600' : 'bg-slate-200'}`}></div>
              <div className={`h-2 w-12 rounded-full ${step >= 2 ? 'bg-primary-600' : 'bg-slate-200'}`}></div>
              <div className={`h-2 w-12 rounded-full ${step >= 3 ? 'bg-primary-600' : 'bg-slate-200'}`}></div>
            </div>
          </div>

          <div className="p-8 min-h-[400px]">
            {/* Step 1: Config & Audience */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nombre de la Campaña</label>
                  <input
                    type="text"
                    placeholder="Ej: Promo Buen Fin 2024"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Segmentar Audiencia (Etiquetas)</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {uniqueTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => setNewCampaign({ ...newCampaign, tagFilter: tag })}
                        className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${newCampaign.tagFilter === tag
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                          }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-blue-900">Alcance Estimado</p>
                      <p className="text-xs text-blue-700">Se enviará a <span className="font-bold">{estimatedAudience}</span> contactos registrados.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Content (Template) */}
            {step === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">Seleccionar Plantilla</label>
                  <p className="text-xs text-slate-500 mb-2">Solo plantillas aprobadas por Meta.</p>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {loadingTemplates ? (
                      <p className="text-sm text-slate-400 p-4">Cargando plantillas...</p>
                    ) : templates.filter(t => t.status === 'APPROVED').map(template => (
                      <div
                        key={template.id}
                        onClick={() => setNewCampaign({ ...newCampaign, templateId: template.id })}
                        className={`p-4 border rounded-xl cursor-pointer transition-all ${newCampaign.templateId === template.id
                          ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-600'
                          : 'border-slate-200 hover:bg-slate-50'
                          }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm font-bold text-slate-900">{template.name}</p>
                          <span className="text-[10px] bg-white border px-1.5 py-0.5 rounded text-slate-500">{template.category}</span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {template.components.find(c => c.type === 'BODY')?.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-slate-100 rounded-2xl p-6 flex items-center justify-center">
                  {selectedTemplate ? (
                    <div className="w-[260px] bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
                      <div className="bg-[#075e54] h-12 flex items-center px-3 gap-2">
                        <div className="w-6 h-6 bg-white/20 rounded-full"></div>
                        <p className="text-white text-xs font-bold">SyncFlow</p>
                      </div>
                      <div className="bg-[#e5ddd5] p-3 min-h-[300px]">
                        <div className="bg-white p-2 rounded-lg shadow-sm rounded-tl-none text-xs text-slate-800">
                          {selectedTemplate.components.find(c => c.type === 'HEADER') && (
                            <div className="h-24 bg-slate-200 mb-2 rounded flex items-center justify-center text-slate-400">
                              <Smartphone className="w-6 h-6" />
                            </div>
                          )}
                          <p className="whitespace-pre-line leading-relaxed">
                            {selectedTemplate.components.find(c => c.type === 'BODY')?.text?.replace(/{{(\d+)}}/g, '...')}
                          </p>
                          <div className="mt-2 space-y-1">
                            {selectedTemplate.components.find(c => c.type === 'BUTTONS')?.buttons?.map((b: any, i: number) => (
                              <div key={i} className="bg-slate-50 text-primary-600 text-center py-1.5 rounded font-bold border border-slate-100">
                                {b.text}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-slate-400">
                      <Eye className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Selecciona una plantilla</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Review & Schedule */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
                  <div className="flex justify-between border-b border-slate-200 pb-4">
                    <span className="text-sm text-slate-500">Campaña</span>
                    <span className="text-sm font-bold text-slate-900">{newCampaign.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-4">
                    <span className="text-sm text-slate-500">Audiencia (Etiqueta)</span>
                    <span className="text-sm font-bold text-slate-900 flex items-center gap-1">
                      {newCampaign.tagFilter} <span className="bg-blue-100 text-blue-700 px-1.5 rounded text-[10px]">{estimatedAudience} pax</span>
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-4">
                    <span className="text-sm text-slate-500">Plantilla</span>
                    <span className="text-sm font-bold text-slate-900">{selectedTemplate?.name}</span>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer p-4 border rounded-xl hover:bg-slate-50 transition-colors">
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                      checked={newCampaign.scheduled}
                      onChange={(e) => setNewCampaign({ ...newCampaign, scheduled: e.target.checked })}
                    />
                    <div>
                      <p className="font-bold text-sm text-slate-900">Programar envío</p>
                      <p className="text-xs text-slate-500">Si no se selecciona, se enviará inmediatamente.</p>
                    </div>
                  </label>

                  {newCampaign.scheduled && (
                    <div className="mt-4 pl-8">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha y Hora</label>
                      <input
                        type="datetime-local"
                        className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
                        onChange={(e) => setNewCampaign({ ...newCampaign, scheduledDate: e.target.value })}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="bg-slate-50 border-t border-slate-200 p-6 flex justify-between">
            <button
              onClick={() => step === 1 ? setView('list') : setStep(step - 1)}
              className="text-slate-500 font-bold text-sm hover:text-slate-800"
            >
              {step === 1 ? 'Cancelar' : 'Atrás'}
            </button>
            <button
              onClick={() => step === 3 ? handleCreate() : setStep(step + 1)}
              disabled={step === 1 && !newCampaign.name || step === 2 && !newCampaign.templateId}
              className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {step === 3 ? (newCampaign.scheduled ? 'Programar' : 'Lanzar Campaña') : 'Siguiente'}
              {step !== 3 && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Render List View ---
  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-8">
      <div className="max-w-[1200px] mx-auto animate-in fade-in duration-500">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Campañas y Difusión</h1>
            <p className="text-slate-500 mt-1">Gestiona envíos masivos para promociones y avisos.</p>
          </div>
          <button
            onClick={() => setView('create')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-primary-200 transition-all"
          >
            <Plus className="w-5 h-5" /> Nueva Campaña
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">
                {loadingCampaigns ? '...' : campaigns.reduce((acc, c) => acc + (c.deliveredCount || 0), 0)}
              </p>
              <p className="text-xs text-slate-500 font-bold uppercase">Mensajes Enviados</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">
                {/* Mock Calculation for Open Rate since we don't have global stats yet */}
                92%
              </p>
              <p className="text-xs text-slate-500 font-bold uppercase">Tasa de Apertura</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">
                {loadingCampaigns ? '...' : campaigns.filter(c => c.status === 'scheduled').length}
              </p>
              <p className="text-xs text-slate-500 font-bold uppercase">Programada</p>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-20">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <BarChart className="w-4 h-4 text-slate-400" />
              Historial de Campañas
            </h3>
            <button className="text-slate-400 hover:text-slate-600"><Filter className="w-4 h-4" /></button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Nombre</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Estado</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Audiencia</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Progreso</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loadingCampaigns ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-400">Cargando historial...</td></tr>
                ) : campaigns.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-400">No hay campañas registradas.</td></tr>
                ) : campaigns.map(camp => (
                  <tr key={camp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-sm text-slate-900">{camp.name}</p>
                      <p className="text-xs text-slate-500">{camp.templateName}</p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(camp.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-700">{camp.audienceSize}</span>
                        {camp.tagFilter !== 'Todos' && <span className="text-[10px] bg-slate-100 border px-1.5 rounded text-slate-500">{camp.tagFilter}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 w-64">
                      {camp.status !== 'scheduled' ? (
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-slate-500">
                            <span>Entregados: {Math.round((camp.deliveredCount / camp.audienceSize) * 100) || 0}%</span>
                            <span>Leídos: {Math.round((camp.readCount / camp.audienceSize) * 100) || 0}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                            <div className="h-full bg-emerald-500" style={{ width: `${(camp.readCount / camp.audienceSize) * 100}%` }}></div>
                            <div className="h-full bg-blue-400" style={{ width: `${((camp.deliveredCount - camp.readCount) / camp.audienceSize) * 100}%` }}></div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Pendiente de envío</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-medium text-slate-700">{camp.sentDate}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Campaigns;