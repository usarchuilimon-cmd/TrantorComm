import React from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  User, 
  MapPin, 
  CheckCircle2, 
  MoreVertical,
  PlusCircle,
  Filter
} from 'lucide-react';
import { APPOINTMENTS, CONTACTS } from '../mockData';

const Appointments = () => {
  return (
    <div className="max-w-[1200px] mx-auto px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Gestión de Citas</h1>
          <p className="text-slate-500 mt-1">Organiza tu agenda y confirma asistencias automáticamente.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary-200">
          <PlusCircle className="w-5 h-5" />
          Nueva Cita
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        <div className="flex border-b border-slate-100 px-6 gap-8">
          <button className="flex items-center gap-2 border-b-2 border-primary-600 text-primary-600 pb-4 pt-5 font-bold text-sm">
            Próximas
          </button>
          <button className="flex items-center gap-2 border-b-2 border-transparent text-slate-500 hover:text-slate-700 pb-4 pt-5 font-bold text-sm transition-colors">
            Pasadas
          </button>
          <button className="ml-auto flex items-center gap-2 text-slate-400 hover:text-slate-600 pb-4 pt-5 text-sm font-semibold">
            <Filter className="w-4 h-4" />
            Filtrar
          </button>
        </div>
        
        {/* List */}
        <div className="divide-y divide-slate-100">
          {APPOINTMENTS.map(apt => {
            const contact = CONTACTS.find(c => c.id === apt.contactId);
            const isConfirmed = apt.status === 'confirmed';
            const isCancelled = apt.status === 'cancelled';
            
            return (
              <div key={apt.id} className="p-6 flex flex-col lg:flex-row lg:items-center gap-6 hover:bg-slate-50 transition-colors group">
                {/* Date Col */}
                <div className="flex lg:flex-col items-center lg:items-start gap-4 lg:gap-1 min-w-[140px]">
                  <p className="text-lg font-extrabold text-slate-900 uppercase">{apt.date}</p>
                  <div className="flex items-center gap-1.5 text-primary-600 bg-primary-50 px-2 py-0.5 rounded text-sm font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    {apt.time}
                  </div>
                </div>

                {/* Contact Col */}
                <div className="flex-1 flex items-center gap-4">
                  <img src={contact?.avatar} alt="" className="w-12 h-12 rounded-full bg-slate-200 object-cover border border-slate-200" />
                  <div>
                    <h4 className="font-bold text-base text-slate-900">{contact?.name}</h4>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                      {contact?.phone}
                    </p>
                  </div>
                </div>

                {/* Type & Status */}
                <div className="flex items-center gap-8 min-w-[300px]">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block mb-1">Tipo de Servicio</span>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      {apt.type.includes('Video') ? <Video className="w-4 h-4 text-primary-500" /> : <MapPin className="w-4 h-4 text-primary-500" />}
                      {apt.type}
                    </div>
                  </div>
                  
                  <div className="ml-auto">
                     <span className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                       isConfirmed ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                       isCancelled ? 'bg-red-50 text-red-700 border-red-200' :
                       'bg-amber-50 text-amber-700 border-amber-200'
                     }`}>
                       {isConfirmed && <CheckCircle2 className="w-3.5 h-3.5" />}
                       {isConfirmed ? 'Confirmada' : isCancelled ? 'Cancelada' : 'Pendiente'}
                     </span>
                  </div>
                </div>

                {/* Actions */}
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-center">
            <button className="text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors">Cargar más citas</button>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
