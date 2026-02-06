import React from 'react';
import {
  MessageSquare,
  Clock,
  Zap,
  TrendingUp,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from 'recharts';
import { ViewState } from '../types';
import { useAuth } from './AuthContext';
import { useDashboardStats } from '../hooks/useDashboardStats';

const StatCard = ({ title, value, change, icon: Icon, colorClass, bgClass }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-3xl font-extrabold mt-1 text-slate-900">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${bgClass}`}>
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>
    </div>
    <div className="mt-4 flex items-center gap-2">
      <span className={`text-sm font-bold ${change.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>
        {change}
      </span>
      <span className="text-xs text-slate-400">vs ayer</span>
    </div>
  </div>
);

interface DashboardProps {
  onNavigate: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = React.useState<'7d' | '24h'>('7d');
  const { stats, loading } = useDashboardStats(user?.organizationId || '', timeRange);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Cargando tablero...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 custom-scrollbar">
      <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            title="Mensajes Nuevos"
            value={stats.newMessages.toString()}
            change="+12%"
            icon={MessageSquare}
            colorClass="text-primary-600"
            bgClass="bg-primary-50"
          />
          <StatCard
            title="Pendientes"
            value={stats.pending.toString()}
            change="+5%"
            icon={Clock}
            colorClass="text-orange-600"
            bgClass="bg-orange-50"
          />
          <StatCard
            title="Chats Activos"
            value={stats.activeChats.toString()}
            change="-2%"
            icon={Zap}
            colorClass="text-emerald-600"
            bgClass="bg-emerald-50"
          />
          <StatCard
            title="Tiempo Promedio"
            value={stats.avgTime}
            change="-10%"
            icon={TrendingUp}
            colorClass="text-blue-600"
            bgClass="bg-blue-50"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
          <div className="xl:col-span-2 space-y-6 md:space-y-8">
            {/* Chart Section */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900">Volumen de Mensajes</h3>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as '7d' | '24h')}
                  className="text-sm border-slate-200 rounded-lg text-slate-600 focus:ring-primary-500 cursor-pointer"
                >
                  <option value="7d">Últimos 7 días</option>
                  <option value="24h">Últimas 24 horas</option>
                </select>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.volumeData}>
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      dy={10}
                    />
                    <Tooltip
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="uv" radius={[4, 4, 0, 0]}>
                      {stats.volumeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 5 ? '#198cb3' : '#bce3f0'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Team Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">Desempeño del Equipo</h3>
                <button onClick={() => onNavigate(ViewState.CONTACTS)} className="text-primary-600 text-sm font-bold hover:underline">Ver Todos</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <th className="px-6 py-4">Agente</th>
                      <th className="px-6 py-4">Estado</th>
                      <th className="px-6 py-4">Chats Activos</th>
                      <th className="px-6 py-4">Resolución</th>
                      <th className="px-6 py-4">Tiempo Prom.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stats.teamMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={member.avatar} alt="" className="w-8 h-8 rounded-full bg-slate-200" />
                            <div>
                              <p className="text-sm font-bold text-slate-900">{member.name}</p>
                              <p className="text-xs text-slate-500">{member.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${member.status === 'online' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                            <span className="text-xs font-medium text-slate-700 capitalize">{member.status === 'online' ? 'Conectado' : 'Ausente'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-700">{member.performance?.activeChats || 0}</td>
                        <td className="px-6 py-4">
                          <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${member.performance?.resolution || 0}%` }}></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-700">{member.performance?.avgTime || '0m'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Alerts Section */}
          <div className="xl:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Alertas Urgentes
                </h3>
                <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">5 Breaches</span>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-red-50 border-l-4 border-red-500">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-bold text-red-900">SLA Excedido: #8892</p>
                    <span className="text-[10px] font-bold text-red-500">22m tarde</span>
                  </div>
                  <p className="text-xs text-red-700 mt-1">Cliente solicitó cancelación. Sin respuesta de Nivel 1.</p>
                  <button
                    onClick={() => onNavigate(ViewState.CONVERSATIONS)}
                    className="mt-3 text-xs font-bold text-red-600 flex items-center gap-1 hover:underline"
                  >
                    Tomar Conversación <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="p-4 rounded-lg bg-orange-50 border-l-4 border-orange-500">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-bold text-orange-900">Pago Rechazado</p>
                    <span className="text-[10px] font-bold text-orange-500">Verificar</span>
                  </div>
                  <p className="text-xs text-orange-700 mt-1">Captura de pantalla enviada por usuario. Revisión manual.</p>
                  <button
                    onClick={() => onNavigate(ViewState.CONVERSATIONS)}
                    className="mt-3 text-xs font-bold text-orange-600 flex items-center gap-1 hover:underline"
                  >
                    Abrir Chat <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <button
                onClick={() => onNavigate(ViewState.CONVERSATIONS)}
                className="w-full mt-6 py-2.5 border-2 border-dashed border-slate-200 text-slate-500 text-sm font-bold rounded-lg hover:border-primary-500 hover:text-primary-600 transition-all"
              >
                Ver Historial de Alertas
              </button>
            </div>

            {/* Campaign Card */}
            <div className="bg-primary-600 p-6 rounded-xl shadow-lg shadow-primary-500/20 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-2">Campaña "Buen Fin"</h3>
                <p className="text-white/80 text-xs mb-6">Activa y llegando a 12k usuarios en Monterrey.</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">8.4%</p>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-white/60">Tasa CTR</p>
                  </div>
                  <button className="bg-white text-primary-600 px-4 py-2 rounded-lg text-xs font-bold shadow-sm hover:scale-105 transition-transform">
                    Ver Analíticas
                  </button>
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute -left-10 -top-10 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-110 transition-transform"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;