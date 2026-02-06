import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { Mic, MicOff, X, Activity, Headphones, Power } from 'lucide-react';

// --- Audio Helper Functions ---

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): { data: string; mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    // Clamp values to [-1, 1] before scaling
    const s = Math.max(-1, Math.min(1, data[i]));
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

// --- Component ---

const LiveAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0); // For visualizer
  const [imgError, setImgError] = useState(false);
  const [error, setError] = useState<string | null>(null); // New error state

  // Configuration
  const AI_AVATAR_URL = "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg";
  const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=AI&background=198cb3&color=fff&rounded=true&bold=true"; // Primary color fallback

  // Audio Context Refs
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef<any>(null); // To hold the live session
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);

  // Initialize and Connect
  const connect = async () => {
    setError(null); // Clear previous errors
    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

      // Setup Audio Contexts
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      inputAudioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;

      // Get Mic Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // Connect to Gemini Live
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            console.log('Gemini Live Connected');
            setIsConnected(true);

            // Setup Input Processing
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = processor;

            processor.onaudioprocess = (e) => {
              if (isMuted) return; // Simple mute logic

              const inputData = e.inputBuffer.getChannelData(0);

              // Visualizer logic (RMS)
              let sum = 0;
              for (let i = 0; i < inputData.length; i++) sum += inputData[i] * inputData[i];
              const rms = Math.sqrt(sum / inputData.length);
              setVolume(Math.min(rms * 5, 1)); // Scale up a bit

              const pcmBlob = createBlob(inputData);
              sessionPromise.then((session: any) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;

            if (base64Audio) {
              if (!outputAudioContextRef.current) return;

              // Ensure nextStartTime is at least current time
              nextStartTimeRef.current = Math.max(
                nextStartTimeRef.current,
                outputAudioContextRef.current.currentTime
              );

              const audioBuffer = await decodeAudioData(
                decode(base64Audio),
                outputAudioContextRef.current,
                24000,
                1
              );

              const source = outputAudioContextRef.current.createBufferSource();
              source.buffer = audioBuffer;
              const gainNode = outputAudioContextRef.current.createGain();
              gainNode.gain.value = 1.0; // Volume

              source.connect(gainNode);
              gainNode.connect(outputAudioContextRef.current.destination);

              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
              });

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            // Handle Interruption
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(src => {
                try { src.stop(); } catch (e) { }
              });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => {
            console.log('Gemini Live Closed');
            handleDisconnect();
          },
          onerror: (e) => {
            console.error('Gemini Live Error', e);
            setError(`Error de Gemini: ${e.message || JSON.stringify(e)}`);
            handleDisconnect();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: "Eres un asistente de soporte técnico experto para SyncFlow, un CRM utilizado por negocios en Monterrey. Hablas español con un tono profesional pero amigable, y usas modismos de Monterrey ocasionalmente (como 'Qué onda', 'Claro que sí'). Tu objetivo es ayudar al usuario (el agente) a navegar el CRM, resolver dudas sobre clientes o funcionalidades. Eres breve y conciso.",
        },
      });

      sessionRef.current = sessionPromise;

    } catch (err: any) {
      console.error("Failed to connect:", err);
      setError(`Error de conexión: ${err.message || String(err)}`);
      handleDisconnect();
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setVolume(0);

    // Close Audio Contexts
    inputAudioContextRef.current?.close();
    outputAudioContextRef.current?.close();
    inputAudioContextRef.current = null;
    outputAudioContextRef.current = null;

    // Stop Stream
    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    mediaStreamRef.current = null;

    // Disconnect script processor
    scriptProcessorRef.current?.disconnect();
    scriptProcessorRef.current = null;

    // Attempt to close session if possible (wrapper doesn't expose close easily usually, but connection drop handles it)
    // In a real implementation, we would call session.close() if exposed or just drop references.
  };

  const toggleConnection = () => {
    if (isConnected) {
      handleDisconnect();
    } else {
      connect();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      handleDisconnect();
    };
  }, []);

  return (
    <>
      <style>{`
        #live-chat-container {
          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.2);
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 0.4; }
          100% { transform: scale(0.95); opacity: 0.8; }
        }
        .visualizer-ring {
          transition: all 0.1s ease-out;
        }
      `}</style>

      {/* Main Container with Requested ID */}
      <div
        id="live-chat-container"
        className={`fixed bottom-6 right-6 z-50 flex flex-col items-end transition-all duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-0'}`}
      >

        {/* Expanded Panel */}
        {isOpen && (
          <div className="bg-white rounded-2xl mb-4 w-80 overflow-hidden border border-slate-200 animate-in slide-in-from-bottom-5 duration-300">
            {/* Header */}
            <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <h3 className="font-bold text-sm">Soporte Live (IA)</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col items-center justify-center min-h-[240px] bg-slate-50 relative">

              {/* Error Message Display */}
              {error && (
                <div className="absolute top-0 left-0 w-full bg-red-50 p-2 border-b border-red-100 flex items-start gap-2 z-20">
                  <Activity className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-red-700 font-mono break-all leading-tight">{error}</p>
                  <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-700">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {isConnected ? (
                <>
                  {/* Active Visualizer */}
                  <div className="relative w-24 h-24 flex items-center justify-center mb-6">
                    <div
                      className="absolute inset-0 bg-primary-500 rounded-full opacity-20 visualizer-ring"
                      style={{ transform: `scale(${1 + volume})` }}
                    ></div>
                    <div
                      className="absolute inset-2 bg-primary-500 rounded-full opacity-20 visualizer-ring"
                      style={{ transform: `scale(${1 + volume * 0.5})` }}
                    ></div>
                    <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center z-10 overflow-hidden">
                      <img
                        src={!imgError ? AI_AVATAR_URL : DEFAULT_AVATAR}
                        onError={() => setImgError(true)}
                        alt="AI Assistant"
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                  </div>

                  <p className="text-slate-900 font-bold mb-1">Escuchando...</p>
                  <p className="text-xs text-slate-500 text-center px-4">
                    Pregunta sobre clientes o funciones del CRM.
                  </p>
                </>
              ) : (
                <>
                  {/* Inactive State */}
                  <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                    <Headphones className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-900 font-bold mb-1">Asistente Desconectado</p>
                  <p className="text-xs text-slate-500 text-center mb-4">
                    Conéctate para hablar con el soporte en tiempo real.
                  </p>
                </>
              )}

              {/* Controls */}
              <div className="flex items-center gap-4 mt-6">
                {isConnected && (
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-3 rounded-full transition-colors ${isMuted ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                  >
                    {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                )}

                <button
                  onClick={toggleConnection}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm shadow-lg transition-all transform active:scale-95 ${isConnected
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-200'
                    : 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-200'
                    }`}
                >
                  <Power className="w-4 h-4" />
                  {isConnected ? 'Desconectar' : 'Conectar'}
                </button>
              </div>

            </div>

            {/* Footer */}
            <div className="p-3 bg-white border-t border-slate-100 text-center">
              <p className="text-[10px] text-slate-400 font-medium">Powered by Gemini Live</p>
            </div>
          </div>
        )}

        {/* Floating Toggle Button */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group w-14 h-14 bg-primary-600 rounded-full shadow-xl shadow-primary-600/30 flex items-center justify-center text-white hover:scale-110 hover:bg-primary-500 transition-all duration-300 relative"
          >
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#f4f5f6]"></span>
            <Headphones className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          </button>
        )}
      </div>
    </>
  );
};

export default LiveAssistant;