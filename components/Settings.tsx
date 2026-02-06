import React, { useState, useEffect } from 'react';
import { User, Bell, Lock, Moon, Globe, LogOut, Check, X, Plug, Clock, PieChart, MessageSquare, Zap, RefreshCw } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext';
import { useOrganization } from '../hooks/useOrganization';
import { supabase } from '../supabaseClient';

const Settings: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, updateProfile } = useAuth();
  const { organization, updateOrganization } = useOrganization(user?.organizationId || '');

  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security' | 'integrations'>('profile');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    language: 'es',
    darkMode: false,
    notifications: true,
    integrations: {
      whatsapp: {
        phoneId: '',
        accessToken: '',
        verifyToken: '',
        businessAccountId: '',
      },
      messenger: {
        pageAccessToken: ''
      }
    },
    automation: {
      timezone: '(GMT-05:00) Eastern Time',
      enabled: false,
      awayMessage: '',
      startTime: '18:00',
      endTime: '09:00'
    }
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Sync state with fetching hooks
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
        language: user.preferences?.language || 'es',
        darkMode: user.preferences?.darkMode || false,
        notifications: user.preferences?.notifications || true,
      }));
    }
    if (organization?.integrations?.whatsapp) {
      setFormData(prev => ({
        ...prev,
        integrations: {
          whatsapp: {
            ...prev.integrations.whatsapp,
            ...organization.integrations!.whatsapp!
          }
        }
      }));
    }
  }, [user, organization]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      // 1. Update Profile & Preferences
      await updateProfile({
        name: formData.name,
        preferences: {
          darkMode: formData.darkMode,
          notifications: formData.notifications,
          language: formData.language as 'es' | 'en'
        }
      });

      // 2. Update Organization (Integrations)
      if (organization) {
        await updateOrganization({
          integrations: {
            ...organization.integrations,
            whatsapp: formData.integrations.whatsapp
          }
        });
      }

      // 3. Update Language Context
      if (formData.language !== language) {
        setLanguage(formData.language as 'es' | 'en');
      }

      setMessage({ text: 'Ajustes guardados correctamente.', type: 'success' });
    } catch (error) {
      console.error(error);
      setMessage({ text: 'Error al guardar cambios.', type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: window.location.origin + '/reset-password', // Ensure this route exists or is handled
    });
    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert('Se ha enviado un correo para restablecer tu contraseña.');
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{t('settings')}</h1>
        <p className="text-slate-500 mb-8">Administra tu perfil, preferencias y conexiones.</p>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-4 space-y-2 shrink-0">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <User className="w-4 h-4" /> Perfil
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'preferences' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <Moon className="w-4 h-4" /> Preferencias
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'security' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <Lock className="w-4 h-4" /> Seguridad
            </button>
            <button
              onClick={() => setActiveTab('integrations')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'integrations' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <Plug className="w-4 h-4" /> Integraciones
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-8 relative">
            {/* Message Toast */}
            {message && (
              <div className={`absolute top-4 right-4 px-4 py-2 rounded-lg text-sm font-bold shadow-lg animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                {message.text}
              </div>
            )}

            {activeTab === 'profile' && user && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">Información Personal</h2>

                <div className="flex items-center gap-6">
                  <img src={user.avatar} alt="Avatar" className="w-20 h-20 rounded-full border-4 border-slate-100" />
                  <button className="text-indigo-600 text-sm font-medium hover:underline">Cambiar Foto</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nombre Completo</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Correo Electrónico</label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Rol / Cargo</label>
                    <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100 w-fit">
                      <ShieldIcon role={user.role} />
                      <span className="text-sm font-bold">{user.role}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">Apariencia y Lenguaje</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <Globe className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800">Idioma</h3>
                        <p className="text-xs text-slate-500">Selecciona el idioma de la interfaz</p>
                      </div>
                    </div>
                    <select
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value as 'es' | 'en' })}
                      className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="es">Español</option>
                      <option value="en">English (US)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <Moon className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800">Modo Oscuro</h3>
                        <p className="text-xs text-slate-500">Reduce la fatiga visual</p>
                      </div>
                    </div>
                    <div
                      onClick={() => setFormData({ ...formData, darkMode: !formData.darkMode })}
                      className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${formData.darkMode ? 'bg-indigo-600' : 'bg-slate-300'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${formData.darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <Bell className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800">Notificaciones</h3>
                        <p className="text-xs text-slate-500">Alertas de sonido y escritorio</p>
                      </div>
                    </div>
                    <div
                      onClick={() => setFormData({ ...formData, notifications: !formData.notifications })}
                      className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${formData.notifications ? 'bg-green-500' : 'bg-slate-300'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${formData.notifications ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">Seguridad</h2>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-800 text-sm mb-4">
                  <p className="font-bold has-[:before]:content-['⚠_']">Recomendación</p>
                  <p>Cambia tu contraseña cada 90 días para mayor seguridad.</p>
                </div>

                <div>
                  <button
                    onClick={handlePasswordReset}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    Solicitar Cambio de Contraseña (Email)
                  </button>
                  <p className="mt-2 text-xs text-slate-500">Te enviaremos un enlace a <strong>{user?.email}</strong> para restablecer tu contraseña de forma segura.</p>
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex justify-between items-end border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Conexiones API y Ajustes</h2>
                    <p className="text-slate-500 text-sm">Gestiona tus credenciales de WhatsApp y Messenger, webhooks y reglas.</p>
                  </div>
                </div>

                {/* Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase">Estado del Sistema</p>
                      <p className="text-lg font-bold text-slate-900">Operacional</p>
                    </div>
                    <Check className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase">Cuota de Mensajes</p>
                        <p className="text-lg font-bold text-slate-900">84% Usado</p>
                      </div>
                      <PieChart className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div className="bg-primary-600 h-1.5 rounded-full" style={{ width: '84%' }}></div>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase">Última Sync</p>
                      <p className="text-lg font-bold text-slate-900">hace 2m</p>
                    </div>
                    <RefreshCw className="w-5 h-5 text-amber-500" />
                  </div>
                </div>

                <div className="flex flex-col xl:flex-row gap-6">
                  {/* Left Column: APIs */}
                  <div className="flex-1 space-y-6">
                    {/* WhatsApp API */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                            <MessageSquare className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800">API WhatsApp Cloud</h3>
                            <p className="text-xs text-slate-500">API Oficial de Negocios</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded-full flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Activo
                        </span>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">ID Número de Teléfono</label>
                            <input
                              type="text"
                              value={formData.integrations.whatsapp.phoneId}
                              onChange={(e) => setFormData({ ...formData, integrations: { ...formData.integrations, whatsapp: { ...formData.integrations.whatsapp, phoneId: e.target.value } } })}
                              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm bg-slate-50"
                              placeholder="1000..."
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">ID Cuenta WhatsApp Business</label>
                            <input
                              type="text"
                              value={formData.integrations.whatsapp.businessAccountId}
                              onChange={(e) => setFormData({ ...formData, integrations: { ...formData.integrations, whatsapp: { ...formData.integrations.whatsapp, businessAccountId: e.target.value } } })}
                              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm bg-slate-50"
                              placeholder="2000..."
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Token de Acceso Permanente</label>
                          <input
                            type="password"
                            value={formData.integrations.whatsapp.accessToken}
                            onChange={(e) => setFormData({ ...formData, integrations: { ...formData.integrations, whatsapp: { ...formData.integrations.whatsapp, accessToken: e.target.value } } })}
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm bg-slate-50"
                            placeholder="EAAG..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Facebook Messenger */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                            <MessageSquare className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800">Facebook Messenger</h3>
                            <p className="text-xs text-slate-500">Integración de Página</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-bold uppercase rounded-full flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div> Desconectado
                        </span>
                      </div>
                      <div className="p-6">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Token de Acceso a Página</label>
                          <input
                            type="password"
                            value={formData.integrations.messenger.pageAccessToken}
                            onChange={(e) => setFormData({ ...formData, integrations: { ...formData.integrations, messenger: { ...formData.integrations.messenger, pageAccessToken: e.target.value } } })}
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm bg-slate-50"
                            placeholder="Paste your Page Access Token here"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Automation Rules */}
                  <div className="w-full xl:w-96 space-y-6 shrink-0">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-800">Reglas de Automatización</h3>
                        <div className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${formData.automation.enabled ? 'bg-indigo-600' : 'bg-slate-300'}`}
                          onClick={() => setFormData({ ...formData, automation: { ...formData.automation, enabled: !formData.automation.enabled } })}>
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${formData.automation.enabled ? 'translate-x-4' : 'translate-x-0'}`} />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Zona Horaria</label>
                          <select
                            value={formData.automation.timezone}
                            onChange={(e) => setFormData({ ...formData, automation: { ...formData.automation, timezone: e.target.value } })}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option>(GMT-05:00) Eastern Time</option>
                            <option>(GMT-06:00) Central Time</option>
                            <option>(GMT-08:00) Pacific Time</option>
                          </select>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="block text-xs font-bold text-slate-500">Respuesta de Ausencia</label>
                          </div>
                          <textarea
                            rows={4}
                            value={formData.automation.awayMessage}
                            onChange={(e) => setFormData({ ...formData, automation: { ...formData.automation, awayMessage: e.target.value } })}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none bg-slate-50"
                            placeholder="Hola {{customer_name}}, gracias por escribirnos. Estamos cerrados."
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Hora de Inicio</label>
                            <input
                              type="time"
                              value={formData.automation.startTime}
                              onChange={(e) => setFormData({ ...formData, automation: { ...formData.automation, startTime: e.target.value } })}
                              className="w-full px-2 py-2 rounded-lg border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Hora de Fin</label>
                            <input
                              type="time"
                              value={formData.automation.endTime}
                              onChange={(e) => setFormData({ ...formData, automation: { ...formData.automation, endTime: e.target.value } })}
                              className="w-full px-2 py-2 rounded-lg border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  if (user) setFormData({ ...formData, name: user.name }); // Simple reset example
                }}
                className="px-6 py-2 text-slate-500 hover:text-slate-800 font-medium transition-colors"
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 ${saving ? 'opacity-70 cursor-wait' : ''}`}
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Guardando...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" /> Guardar Cambios
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// Helper for Role Icon
const ShieldIcon: React.FC<{ role: string }> = ({ role }) => {
  return <User className="w-4 h-4" />
};

export default Settings;
