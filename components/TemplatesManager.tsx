import React, { useState } from 'react';
import {
    RefreshCw,
    Plus,
    Search,
    CheckCircle2,
    Clock,
    XCircle,
    Smartphone,
    MoreHorizontal
} from 'lucide-react';
import { WhatsAppTemplate } from '../types';
import { useAuth } from './AuthContext';
import { useTemplates } from '../hooks/useTemplates';

const TemplatesManager: React.FC = () => {
    const { user } = useAuth();
    const { templates, loading, syncTemplates } = useTemplates(user?.organizationId || '');
    const [filter, setFilter] = useState<'ALL' | 'APPROVED' | 'PENDING' | 'REJECTED'>('ALL');
    const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'MARKETING' | 'UTILITY' | 'AUTHENTICATION'>('ALL');
    const [search, setSearch] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);

    const handleSync = async () => {
        setIsSyncing(true);
        await syncTemplates();
        setIsSyncing(false);
        alert('Plantillas sincronizadas con Meta correctamente.');
    };

    const filteredTemplates = templates.filter(t => {
        const matchesFilter = filter === 'ALL' || t.status === filter;
        const matchesCategory = categoryFilter === 'ALL' || t.category === categoryFilter;
        const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesCategory && matchesSearch;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APPROVED': return <span className="flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-[10px] font-bold uppercase"><CheckCircle2 className="w-3 h-3" /> Aprobada</span>;
            case 'PENDING': return <span className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-[10px] font-bold uppercase"><Clock className="w-3 h-3" /> Pendiente</span>;
            case 'REJECTED': return <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-md text-[10px] font-bold uppercase"><XCircle className="w-3 h-3" /> Rechazada</span>;
            default: return null;
        }
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium">Cargando plantillas de WhatsApp...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto bg-slate-50 p-8">
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900">Plantillas de WhatsApp</h1>
                        <p className="text-slate-500 mt-1">Sincroniza y gestiona las plantillas aprobadas por Meta.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleSync}
                            className={`bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${isSyncing ? 'animate-pulse' : ''}`}
                            disabled={isSyncing}
                        >
                            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                            {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
                        </button>
                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-200 transition-all">
                            <Plus className="w-5 h-5" /> Nueva Plantilla
                        </button>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
                        {['ALL', 'APPROVED', 'PENDING', 'REJECTED'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as any)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${filter === f
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                    }`}
                            >
                                {f === 'ALL' ? 'Todos los Estados' : f}
                            </button>
                        ))}
                    </div>
                    {/* Category Filter */}
                    <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 border-l border-slate-200 pl-4">
                        {['ALL', 'MARKETING', 'UTILITY', 'AUTHENTICATION'].map((c) => (
                            <button
                                key={c}
                                onClick={() => setCategoryFilter(c as any)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${categoryFilter === c
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                    }`}
                            >
                                {c === 'ALL' ? 'Todas las Categorías' : c}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar plantilla..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.map(template => (
                        <div key={template.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            {/* Card Header */}
                            <div className="p-4 border-b border-slate-100 flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-slate-900 truncate w-48" title={template.name}>{template.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        {getStatusBadge(template.status)}
                                        <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{template.category}</span>
                                        <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{template.language}</span>
                                    </div>
                                </div>
                                <button className="text-slate-300 hover:text-slate-600">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Preview Area */}
                            <div className="bg-[#e5ddd5] p-4 min-h-[200px] flex flex-col justify-center">
                                <div className="bg-white rounded-lg rounded-tl-none p-2 shadow-sm max-w-[90%] self-start relative">
                                    {/* Triangle */}
                                    <div className="absolute top-0 -left-2 w-0 h-0 border-t-[10px] border-t-white border-l-[10px] border-l-transparent"></div>

                                    {/* Header */}
                                    {template.components.find(c => c.type === 'HEADER') && (
                                        <div className="h-24 bg-slate-200 mb-2 rounded flex items-center justify-center text-slate-400 overflow-hidden">
                                            {template.components.find(c => c.type === 'HEADER')?.format === 'IMAGE' ? (
                                                <div className="flex flex-col items-center">
                                                    <Smartphone className="w-6 h-6 mb-1" />
                                                    <span className="text-[9px] font-bold uppercase">Imagen</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs font-bold">{template.components.find(c => c.type === 'HEADER')?.text}</span>
                                            )}
                                        </div>
                                    )}

                                    {/* Body */}
                                    <p className="text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                                        {template.components.find(c => c.type === 'BODY')?.text?.replace(/{{(\d+)}}/g, '{{$1}}')}
                                    </p>

                                    {/* Footer */}
                                    {template.components.find(c => c.type === 'FOOTER') && (
                                        <p className="text-[10px] text-slate-400 mt-2">
                                            {template.components.find(c => c.type === 'FOOTER')?.text}
                                        </p>
                                    )}
                                </div>

                                {/* Buttons */}
                                {template.components.find(c => c.type === 'BUTTONS') && (
                                    <div className="mt-2 space-y-1 max-w-[90%]">
                                        {template.components.find(c => c.type === 'BUTTONS')?.buttons?.map((b: any, i: number) => (
                                            <div key={i} className="bg-white text-emerald-500 text-center py-2 rounded shadow-sm text-xs font-bold cursor-pointer hover:bg-slate-50">
                                                {b.type === 'URL' ? '🔗 ' : b.type === 'PHONE_NUMBER' ? '📞 ' : ''}{b.text}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer Stats / Actions */}
                            <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                                <span>ID: {template.id}</span>
                                <span className="font-mono">Last Update: Today</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {filteredTemplates.length === 0 && (
                <div className="flex flex-col items-center justify-center mt-20 text-slate-400">
                    <p>No se encontraron plantillas.</p>
                </div>
            )}
        </div>
    );
};

export default TemplatesManager;
