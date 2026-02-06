import React, { useState } from 'react';
import {
    HelpCircle,
    MessageCircle,
    Book,
    FileText,
    Mail,
    ChevronDown,
    ChevronUp,
    PlayCircle
} from 'lucide-react';

const HelpCenter: React.FC = () => {
    const [openFaq, setOpenFaq] = useState<string | null>(null);

    const faqs = [
        {
            id: '1',
            question: '¿Cómo conecto mi número de WhatsApp?',
            answer: 'Para conectar tu número, ve a Configuración > Integraciones. Necesitarás tener una cuenta de Meta Business y acceso a la API de WhatsApp Cloud. Sigue los pasos del asistente para escanear el código o ingresar tus credenciales.'
        },
        {
            id: '2',
            question: '¿Puedo tener múltiples agentes atendiendo el mismo número?',
            answer: '¡Sí! 1a Fundación está diseñado para equipos. Puedes invitar a tantos agentes como necesites y todos compartirán la misma bandeja de entrada unificada de WhatsApp.'
        },
        {
            id: '3',
            question: '¿Cómo funcionan las plantillas de mensajes?',
            answer: 'Las plantillas son mensajes pre-aprobados por Meta para iniciar conversaciones (marketing, notificaciones). Ve a la sección "Plantillas" para crear y sincronizar tus plantillas. Una vez aprobadas, podrás usarlas en tus Campañas.'
        },
        {
            id: '4',
            question: '¿Qué hago si un mensaje no se envía?',
            answer: 'Verifica primero tu conexión a internet y que el plan de tu organización esté activo. Si el problema persiste, revisa el estado de la API de Meta en Configuración. Si es un error de "Ventana de 24h", recuerda que solo puedes enviar plantillas si el usuario no ha respondido en las últimas 24 horas.'
        }
    ];

    const toggleFaq = (id: string) => {
        setOpenFaq(openFaq === id ? null : id);
    };

    return (
        <div className="h-full overflow-y-auto bg-slate-50 p-8">
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">

                {/* Header */}
                <div className="text-center space-y-4 mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl mb-2">
                        <HelpCircle className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900">¿Cómo podemos ayudarte?</h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Encuentra respuestas rápidas, guías detalladas y soporte directo de nuestro equipo.
                    </p>
                </div>

                {/* Quick Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Book className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 mb-2">Documentación</h3>
                        <p className="text-sm text-slate-500">
                            Explora nuestras guías paso a paso para configurar y sacar el máximo provecho a la plataforma.
                        </p>
                        <span className="text-blue-600 text-sm font-bold mt-4 inline-block hover:underline">Ver Guías &rarr;</span>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <PlayCircle className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 mb-2">Video Tutoriales</h3>
                        <p className="text-sm text-slate-500">
                            Aprende visualmente con nuestra biblioteca de videos cortos sobre funcionalidades clave.
                        </p>
                        <span className="text-emerald-600 text-sm font-bold mt-4 inline-block hover:underline">Ver Videos &rarr;</span>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <MessageCircle className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 mb-2">Soporte Chat</h3>
                        <p className="text-sm text-slate-500">
                            Habla directamente con nuestro equipo de soporte técnico. Horario: Lunes a Viernes 9am - 6pm.
                        </p>
                        <span className="text-purple-600 text-sm font-bold mt-4 inline-block hover:underline">Iniciar Chat &rarr;</span>
                    </div>
                </div>

                {/* FAQs */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-100">
                        <h2 className="text-2xl font-bold text-slate-900">Preguntas Frecuentes</h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {faqs.map((faq) => (
                            <div key={faq.id} className="group">
                                <button
                                    onClick={() => toggleFaq(faq.id)}
                                    className="w-full text-left px-8 py-6 flex justify-between items-center hover:bg-slate-50 transition-colors focus:outline-none"
                                >
                                    <span className={`font-bold text-slate-800 ${openFaq === faq.id ? 'text-primary-600' : ''}`}>
                                        {faq.question}
                                    </span>
                                    {openFaq === faq.id ? (
                                        <ChevronUp className="w-5 h-5 text-primary-500" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                                    )}
                                </button>
                                <div
                                    className={`
                                        overflow-hidden transition-all duration-300 ease-in-out
                                        ${openFaq === faq.id ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}
                                    `}
                                >
                                    <div className="px-8 pb-6 text-slate-600 text-sm leading-relaxed border-t border-transparent">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Footer */}
                <div className="bg-gradient-to-r from-primary-900 to-indigo-900 rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-4">¿Aún necesitas ayuda?</h2>
                        <p className="text-primary-100 mb-8 max-w-xl mx-auto">
                            Si no encuentras lo que buscas, envíanos un correo electrónico y te responderemos en menos de 24 horas.
                        </p>
                        <a
                            href="mailto:soporte@1afundacion.org"
                            className="inline-flex items-center gap-2 bg-white text-primary-900 px-6 py-3 rounded-xl font-bold hover:bg-primary-50 transition-colors shadow-lg"
                        >
                            <Mail className="w-5 h-5" />
                            soporte@1afundacion.org
                        </a>
                    </div>

                    {/* Abstract Shapes */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
                </div>

            </div>
        </div>
    );
};

export default HelpCenter;
