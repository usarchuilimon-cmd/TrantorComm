import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Mail, Lock, Loader2, AlertCircle, Quote, User, Smartphone, Briefcase, Building2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [position, setPosition] = useState('');
    const [department, setDepartment] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<'login' | 'signup' | 'magic' | 'forgot'>('login');

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (mode === 'magic') {
                const { error } = await supabase.auth.signInWithOtp({
                    email,
                    options: { emailRedirectTo: window.location.origin }
                });
                if (error) throw error;
                alert('¡Enlace mágico enviado! Revisa tu correo.');
            } else if (mode === 'forgot') {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/reset-password`,
                });
                if (error) throw error;
                alert('¡Correo de recuperación enviado! Revisa tu bandeja de entrada.');
                setMode('login');
            } else if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            phone: phone,
                            position: position,
                            department: department
                        }
                    }
                });
                if (error) throw error;
                alert('¡Cuenta creada! Por favor inicia sesión.');
                setMode('login');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });
                if (error) throw error;
            }
        } catch (err: any) {
            setError(err.message || 'Error de autenticación');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex overflow-hidden">

            {/* Left Branding Panel */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 relative flex-col justify-between p-16 text-white overflow-hidden">
                {/* Background Effect */}
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-900/0 via-slate-900/60 to-slate-900/90"></div>

                {/* Top Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center border border-primary-500/20">
                        <div className="w-3 h-3 rounded-full bg-primary-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
                    </div>
                    <span className="text-2xl font-bold tracking-tight">1a <span className="text-primary-400">Fundación</span></span>
                </div>

                {/* Middle Content */}
                <div className="relative z-10 max-w-lg">
                    <h1 className="text-5xl font-bold leading-tight mb-6">Comunicación inteligente para tu organización.</h1>
                    <p className="text-lg text-slate-300 leading-relaxed font-light">
                        Gestiona conversaciones de WhatsApp, automatiza campañas y organiza tus contactos en una sola plataforma. Conecta con tu audiencia de manera efectiva y escalable.
                    </p>
                </div>

                {/* Bottom Testimonial & Footer */}
                <div className="relative z-10">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl mb-8">
                        <div className="flex gap-1 mb-4 text-primary-400">
                            {'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
                        </div>
                        <p className="text-lg italic text-slate-200 mb-4">"Desde que usamos la plataforma de 1a Fundación, nuestra capacidad de respuesta ha mejorado un 200%. La gestión de campañas es simplemente impecable y nos ahorra horas de trabajo."</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-xs font-bold shadow-lg shadow-primary-900/20">MR</div>
                            <div>
                                <p className="font-bold text-sm">Mariana Rodríguez</p>
                                <p className="text-xs text-slate-400">Gerente de Comunicación</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-6 text-xs text-slate-500 font-medium">
                        <span>© 2026 1a Fundación.</span>
                        <a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a>
                        <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
                    </div>
                </div>
            </div>

            {/* Right Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-24 relative bg-slate-50">
                <div className={`w-full max-w-md ${mode === 'signup' ? 'space-y-4' : 'space-y-8'}`}>
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">
                            {mode === 'signup' ? 'Solicita tu acceso' : (mode === 'forgot' ? 'Recuperar Contraseña' : (mode === 'magic' ? 'Acceso sin contraseña' : 'Bienvenido a 1a Fundación'))}
                        </h2>
                        <p className="text-slate-500">
                            {mode === 'signup' ? 'Regístrate para gestionar tus comunicaciones.' : (mode === 'forgot' ? 'Te enviaremos un enlace para restablecerla.' : (mode === 'magic' ? 'Te enviaremos un enlace mágico a tu correo.' : 'Accede a tu panel de control.'))}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium flex items-center gap-3 border border-red-100 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleAuth} className="space-y-4">

                        {mode === 'signup' && (
                            <>
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-slate-700">Nombre Completo</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                            placeholder="Ej. Juan Pérez"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-slate-700">Celular</label>
                                        <div className="relative">
                                            <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                                placeholder="55 1234 5678"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-slate-700">Puesto</label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="text"
                                                value={position}
                                                onChange={(e) => setPosition(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                                placeholder="Ej. Gerente"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-slate-700">Departamento</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <select
                                            value={department}
                                            onChange={(e) => setDepartment(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-medium text-slate-900 placeholder:text-slate-400 appearance-none"
                                            required
                                        >
                                            <option value="" disabled>Seleccione una opción...</option>
                                            <option value="Ventas">Ventas</option>
                                            <option value="Marketing">Marketing</option>
                                            <option value="Soporte">Soporte</option>
                                            <option value="Operaciones">Operaciones</option>
                                            <option value="Dirección">Dirección</option>
                                            <option value="TI">Tecnología / TI</option>
                                        </select>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700">Correo Electrónico</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                    placeholder="nombre@empresa.com"
                                    required
                                />
                            </div>
                        </div>

                        {mode === 'login' && (
                            <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-slate-700">Contraseña</label>
                                    <button type="button" onClick={() => setMode('forgot')} className="text-xs font-bold text-primary-600 hover:text-primary-700 hover:underline">
                                        ¿Olvidaste tu contraseña?
                                    </button>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {mode === 'signup' && (
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700">Contraseña</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-primary-900/20 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-6 transform active:scale-[0.98]"
                        >
                            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                            {loading
                                ? 'Procesando...'
                                : (mode === 'magic' ? 'Enviar Enlace Mágico' : (mode === 'forgot' ? 'Enviar Correo de Recuperación' : (mode === 'signup' ? 'Crear Cuenta' : 'Iniciar Sesión')))}
                        </button>
                    </form>

                    <div className="pt-2 text-center">
                        <p className="text-sm text-slate-500">
                            {(mode === 'login' || mode === 'magic' || mode === 'forgot') ? '¿Todavía no tienes cuenta?' : '¿Ya tienes una cuenta?'} {' '}
                            <button
                                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                                className="font-bold text-primary-600 hover:underline"
                            >
                                {(mode === 'login' || mode === 'magic' || mode === 'forgot') ? 'Regístrate ahora' : 'Inicia Sesión aquí'}
                            </button>
                        </p>

                        {(mode === 'login') && (
                            <p className="mt-4 text-xs">
                                <button onClick={() => setMode('magic')} className="text-slate-400 hover:text-slate-600 underline">
                                    Ingresar sin contraseña (Magic Link)
                                </button>
                            </p>
                        )}
                        {(mode === 'magic' || mode === 'forgot') && (
                            <p className="mt-4 text-xs">
                                <button onClick={() => setMode('login')} className="text-slate-400 hover:text-slate-600 underline">
                                    Volver al inicio de sesión
                                </button>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
