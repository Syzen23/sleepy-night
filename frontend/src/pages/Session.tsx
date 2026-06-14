import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PhoneIcon } from '@heroicons/react/24/solid';
import PageLayout from '../components/PageLayout';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

enum CallState {
  Incoming,
  Connected,
}

const Session = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionId = location.state?.sessionId || 1;
  const sessionMood = location.state?.mood || 'Calm';

  const [callState, _setCallState] = useState<CallState>(CallState.Incoming);
  const callStateRef = useRef<CallState>(CallState.Incoming);
  const setCallState = (state: CallState) => {
    callStateRef.current = state;
    _setCallState(state);
  };

  const [isRecording, setIsRecording] = useState(false);
  const isRecordingRef = useRef(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const isProcessingRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    isProcessingRef.current = isProcessing;
    isPlayingRef.current = isPlaying;
    isRecordingRef.current = isRecording;
  }, [isProcessing, isPlaying, isRecording]);

  const [aiText, setAiText] = useState<string>('');
  const [latestSummary, setLatestSummary] = useState<any>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const conversationHistory = useRef<{ role: 'user' | 'assistant', content: string }[]>([]);

  const mediaStream = useRef<MediaStream | null>(null);
  const audioPlayer = useRef<HTMLAudioElement | null>(null);
  const speechRecognition = useRef<any>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const finalTranscript = useRef<string>('');
  const currentInterim = useRef<string>('');
  const silenceTimer = useRef<NodeJS.Timeout | null>(null);
  const noInputTimer = useRef<NodeJS.Timeout | null>(null);
  const hasRemindedSleep = useRef(false);

  // Live Subtitles for UI feedback
  const [liveUserText, setLiveUserText] = useState<string>('');

  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const dataArray = useRef<Uint8Array | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const micSource = useRef<MediaStreamAudioSourceNode | null>(null);
  const aiAudioSource = useRef<MediaElementAudioSourceNode | null>(null);

  const ringsRef = useRef<(HTMLDivElement | null)[]>([]);

  const ringtoneAudio = useRef<HTMLAudioElement | null>(null);

  const startRingtone = () => {
    if (!ringtoneAudio.current) {
      ringtoneAudio.current = new Audio('/assets/sounds/ringstone.mp3');
      ringtoneAudio.current.loop = true;
    }
    ringtoneAudio.current.play().catch(e => {
      console.warn("Could not play HTML5 ringtone:", e);
    });
  };

  const stopRingtone = () => {
    if (ringtoneAudio.current) {
      ringtoneAudio.current.pause();
      ringtoneAudio.current.currentTime = 0;
    }
  };

  useEffect(() => {
    if (callState === CallState.Incoming) {
      startRingtone();
    } else {
      stopRingtone();
    }
    return () => {
      stopRingtone();
    };
  }, [callState]);

  // GSAP Animation for "Thinking" state (Staggered ring scan)
  useGSAP(() => {
    if (isProcessing) {
      ringsRef.current.forEach((ring, i) => {
        if (ring) {
          gsap.to(ring, {
            scale: 1.6,
            opacity: 0,
            duration: 1.5,
            repeat: -1,
            delay: i * 0.4,
            ease: "power1.out",
            overwrite: "auto"
          });
        }
      });
    } else {
      ringsRef.current.forEach((ring) => {
        if (ring) {
          gsap.killTweensOf(ring);
          // Reset to default
          gsap.to(ring, {
            scale: 1.0,
            opacity: 0,
            duration: 0.2,
            overwrite: "auto"
          });
        }
      });
    }
  }, [isProcessing]);

  useEffect(() => {
    return () => {
      endCallCleanup();
    };
  }, []);

  const endCallCleanup = () => {
    stopRingtone();
    ringtoneAudio.current = null;
    if (silenceTimer.current) clearTimeout(silenceTimer.current);
    if (noInputTimer.current) clearTimeout(noInputTimer.current);
    if (audioPlayer.current) {
      audioPlayer.current.pause();
      audioPlayer.current.src = '';
      audioPlayer.current = null;
    }
    // Stop browser TTS if active
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach(track => track.stop());
    }
    if (speechRecognition.current) {
      speechRecognition.current.stop();
    }
    if (audioContext.current?.state !== 'closed') {
      audioContext.current?.close().catch(() => {});
    }
    setIsPlaying(false);
    setIsRecording(false);
    setAiText('');
  };

  const vadActive = useRef<boolean>(false);

  const detectSilenceVAD = () => {
    if (!vadActive.current || !analyser.current || !dataArray.current || !isRecordingRef.current) {
      vadActive.current = false;
      return;
    }

    analyser.current.getByteFrequencyData(dataArray.current);
    let sum = 0;
    for (let i = 0; i < dataArray.current.length; i++) {
      sum += dataArray.current[i];
    }
    const avg = sum / dataArray.current.length;
    
    // Jika volume suara terdeteksi di atas batas ambang bising (12)
    if (avg > 12) {
       if (noInputTimer.current) clearTimeout(noInputTimer.current);
       if (silenceTimer.current) clearTimeout(silenceTimer.current);
       
       // Setel timer berhenti merekam jika hening 2 detik setelah bicara
       silenceTimer.current = setTimeout(() => {
          if (callStateRef.current === CallState.Connected && isRecordingRef.current) {
             stopRecording();
          }
       }, 2000);
    }

    // Loop ringan: cek setiap 100ms (10 kali sedetik), hampir tidak memakan CPU
    setTimeout(detectSilenceVAD, 100); 
  };

  const updateWaveform = () => {
    // Animasi telah dinonaktifkan sepenuhnya untuk meringankan beban CPU di HP (Sesuai request user)
    return;
  };

  const startRecording = async () => {
    try {
      if (!mediaStream.current || !mediaStream.current.active) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStream.current = stream;
        
        let mimeType = 'audio/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/mp4';
        }
        mediaRecorder.current = new MediaRecorder(stream, { mimeType });
        mediaRecorder.current.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunks.current.push(e.data);
        };
        mediaRecorder.current.onstop = () => {
          const audioBlob = new Blob(audioChunks.current, { type: mimeType });
          audioChunks.current = [];
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => {
             const base64Audio = reader.result as string;
             sendTranscriptToServer(base64Audio);
          };
        };
        
        if (audioContext.current && analyser.current) {
          if (micSource.current) micSource.current.disconnect();
          micSource.current = audioContext.current.createMediaStreamSource(stream);
          micSource.current.connect(analyser.current);
        }
      }

      finalTranscript.current = '';
      currentInterim.current = '';
      setLiveUserText('');
      audioChunks.current = [];

      if (mediaRecorder.current && mediaRecorder.current.state === 'inactive') {
        mediaRecorder.current.start();
      }

      if (noInputTimer.current) clearTimeout(noInputTimer.current);
      noInputTimer.current = setTimeout(() => {
        if (callStateRef.current === CallState.Connected && isRecordingRef.current) {
           finalTranscript.current = '[SILENCE]';
           stopRecording();
        }
      }, 9000);

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        speechRecognition.current = new SpeechRecognition();
        speechRecognition.current.continuous = true;
        speechRecognition.current.interimResults = true;
        speechRecognition.current.lang = 'id-ID';
        
        speechRecognition.current.onresult = (event: any) => {
          let hasNewInput = false;
          let interim = '';
          
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            hasNewInput = true;
            if (event.results[i].isFinal) {
              finalTranscript.current += event.results[i][0].transcript + ' ';
            } else {
              interim += event.results[i][0].transcript;
            }
          }
          
          currentInterim.current = interim;
          setLiveUserText(finalTranscript.current + interim);

          if (hasNewInput) {
             if (noInputTimer.current) clearTimeout(noInputTimer.current);
             if (silenceTimer.current) clearTimeout(silenceTimer.current);
             silenceTimer.current = setTimeout(() => {
                if (callStateRef.current === CallState.Connected) {
                  stopRecording();
                }
             }, 1200); // 1.2s silence triggers send
          }
        };
        
        speechRecognition.current.start();
      } else {
        console.warn("Speech Recognition API not supported in this browser.");
      }

      if (!vadActive.current) {
        vadActive.current = true;
        detectSilenceVAD();
      }

      setIsRecording(true);
      isRecordingRef.current = true;
      setIsProcessing(false);
      setIsPlaying(false);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Tidak dapat mengakses mikrofon. Pastikan izin telah diberikan.");
      rejectCall();
    }
  };

  const stopRecording = () => {
    if (silenceTimer.current) clearTimeout(silenceTimer.current);
    if (noInputTimer.current) clearTimeout(noInputTimer.current);
    if (isRecordingRef.current) {
      if (speechRecognition.current) speechRecognition.current.stop();
      // We DO NOT stop the mediaStream tracks here so it can be reused smoothly.
      
      setIsRecording(false);
      isRecordingRef.current = false;
      vadActive.current = false;
      setIsProcessing(true);

      if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
        mediaRecorder.current.stop(); // This triggers onstop, which calls sendTranscriptToServer
      } else {
        setTimeout(() => {
          if (callStateRef.current === CallState.Connected) {
            sendTranscriptToServer();
          }
        }, 100);
      }
    }
  };

  const sendTranscriptToServer = async (base64Audio?: string) => {
    try {
      let transcript = (finalTranscript.current + ' ' + currentInterim.current).trim();
      setLiveUserText(''); // clear user text
      
      // Jika speechRecognition gagal tapi kita punya audio dari MediaRecorder, kita hanya pakai [VOICE_INPUT]
      if (!transcript && base64Audio) {
        transcript = ""; // Backend will use whisper to transcribe it
      } else if (!transcript && !base64Audio) {
        startRecording();
        return;
      }

      const now = new Date();
      const currentHour = now.getHours();
      const currentMin = now.getMinutes();
      const bedtimeStr = localStorage.getItem('appBedtime') || '23:00';
      const [bedHour, bedMin] = bedtimeStr.split(':').map(Number);
      
      let isPastBedtime = false;
      if (currentHour >= 0 && currentHour < 5) {
        isPastBedtime = true; 
      } else if (currentHour > bedHour || (currentHour === bedHour && currentMin >= bedMin)) {
        isPastBedtime = true;
      }

      if (isPastBedtime && !hasRemindedSleep.current && conversationHistory.current.length >= 2) {
        transcript += " [SYSTEM: Waktu tidur pengguna sudah lewat. Akhiri obrolan dengan lembut dan suruh pengguna istirahat.]";
        hasRemindedSleep.current = true;
      }

      const historyToSend = [...conversationHistory.current];

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/session/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mood: sessionMood, 
          transcript: transcript,
          history: historyToSend,
          voice: localStorage.getItem('appVoice') || 'Tessa (Momy)',
          audioBase64: base64Audio
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      
      if (data.success && callStateRef.current === CallState.Connected) {
        const responseText = data.data.aiResponse;
        setAiText(responseText);
        
        conversationHistory.current.push({ role: 'user', content: transcript });
        conversationHistory.current.push({ role: 'assistant', content: responseText });

        setLatestSummary(data.data);

        setIsProcessing(false);

        if (data.data.audioBase64) {
          const audio = new Audio("data:audio/wav;base64," + data.data.audioBase64);
          audioPlayer.current = audio;
          
          if (audioContext.current && analyser.current) {
            if (aiAudioSource.current) aiAudioSource.current.disconnect();
            try {
               aiAudioSource.current = audioContext.current.createMediaElementSource(audio);
               aiAudioSource.current.connect(analyser.current); 
               aiAudioSource.current.connect(audioContext.current.destination); 
            } catch(e) {
               console.warn("Could not connect AI audio to analyzer", e);
            }
          }

          audio.onplay = () => setIsPlaying(true);
          audio.onended = () => {
            setIsPlaying(false);
            setAiText('');
            if (callStateRef.current === CallState.Connected) {
              startRecording(); // Hands-free loop!
            }
          };
          
          setTimeout(() => {
            if (callStateRef.current === CallState.Connected) {
              audio.play().catch((e) => {
                console.error("Audio playback failed:", e);
                fallbackTTS(responseText);
              });
            }
          }, 50);
        } else if ('speechSynthesis' in window) {
          fallbackTTS(responseText);
        } else {
          setTimeout(() => {
            setIsPlaying(false);
            setAiText('');
            if (callStateRef.current === CallState.Connected) startRecording();
          }, 4000);
        }

        function fallbackTTS(text: string) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'id-ID';
          
          utterance.onstart = () => setIsPlaying(true);
          
          utterance.onend = () => {
            setIsPlaying(false);
            setAiText('');
            if (callStateRef.current === CallState.Connected) startRecording();
          };
          window.speechSynthesis.speak(utterance);
        }
      }

    } catch (error) {
      console.error('Error sending transcript:', error);
      setIsProcessing(false);
      if (callStateRef.current === CallState.Connected) startRecording();
    }
  };

  const acceptCall = () => {
    setCallState(CallState.Connected);
    
    const ctx = new window.AudioContext();
    audioContext.current = ctx;
    analyser.current = ctx.createAnalyser();
    analyser.current.fftSize = 64;
    dataArray.current = new Uint8Array(analyser.current.frequencyBinCount);
    
    updateWaveform();
    startRecording();
  };

  const rejectCall = () => {
    endCallCleanup();
    navigate('/');
  };

  const endCall = async () => {
    endCallCleanup();
    
    // If no conversation happened, just go home
    if (conversationHistory.current.length === 0) {
      navigate('/');
      return;
    }

    setIsFinishing(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/session/end`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: sessionMood,
          history: conversationHistory.current
        })
      });

      if (!response.ok) throw new Error('Failed to generate summary');
      const result = await response.json();

      if (result.success && result.data) {
        const finalSummary = result.data; // this is the session row saved to Neon

        // Save to localStorage for Thoughts page
        try {
          const existing = JSON.parse(localStorage.getItem('thoughtsHistory') || '[]');
          const now = new Date();
          const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });
          const newThought = {
            id: finalSummary.id || Date.now().toString(),
            date: dateStr,
            mood: finalSummary.mood || 'Reflective',
            snippet: conversationHistory.current[conversationHistory.current.length - 1]?.content || 'Sesi malam ini...',
            summary: {
              today: finalSummary.summaryShared || [],
              tomorrow: finalSummary.summaryTomorrow || [],
              letGo: finalSummary.summaryLetGo || [],
            }
          };
          existing.unshift(newThought);
          localStorage.setItem('thoughtsHistory', JSON.stringify(existing));
        } catch (e) {
          console.warn('Failed to save thought to localStorage:', e);
        }

        navigate('/closure', { state: { summary: finalSummary } });
      } else {
        throw new Error('Invalid response data');
      }
    } catch (err) {
      console.error('Error ending session:', err);
      alert('Gagal membuat rangkuman malam ini. Silakan coba lagi.');
      setIsFinishing(false);
    }
  };

  if (isFinishing) {
    return (
      <PageLayout innerClassName="gap-10 md:gap-16 justify-center items-center" gradientFrom="from-primary/10">
        <div className="text-center space-y-6 w-full max-w-xs mx-auto mt-20">
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse border border-primary/30"></div>
            <div className="w-16 h-16 rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl text-white font-light tracking-wide">Mempersiapkan Rangkuman</h1>
            <p className="text-on-surface-variant text-sm font-light leading-relaxed">
              Tunggu sebentar ya, aku sedang merapikan rangkuman obrolan kita malam ini...
            </p>
          </div>
        </div>
      </PageLayout>
    );
  }

  let statusTitle = "Khansa";
  let statusSub = "Incoming call...";
  if (callState === CallState.Connected) {
    if (isProcessing) {
      statusTitle = "Thinking...";
      statusSub = "Tunggu sebentar...";
    } else if (isPlaying) {
      statusTitle = "Speaking";
      statusSub = "Mendengarkan balasan...";
    } else if (isRecording) {
      statusTitle = "Connected";
      statusSub = "Silakan bicara (Otomatis membalas saat kamu diam)";
    }
  }

  return (
    <PageLayout 
      innerClassName="gap-6 md:gap-8 justify-center min-h-[90vh]" 
      gradientFrom="from-[#0a0f0d]/80"
      backgroundElement={
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] bg-blue-900/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
        </div>
      }
    >

      <div className="text-center space-y-3 w-full mt-4 relative z-10">
        <h1 className="text-4xl md:text-5xl text-white font-light tracking-widest drop-shadow-md">{statusTitle}</h1>
        <p className="text-primary/80 whitespace-pre-line leading-relaxed max-w-[300px] mx-auto text-sm md:text-base font-light tracking-wide opacity-90">
          {statusSub}
        </p>
      </div>

      <div className="relative flex items-center justify-center w-[300px] h-[300px] my-6 z-10">
        {/* Dynamic Concentric Rings */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            ref={el => ringsRef.current[i] = el}
            className={`absolute rounded-full border opacity-0 pointer-events-none transition-colors duration-700 ${
              isPlaying 
                ? 'border-blue-400/30 bg-blue-400/5 shadow-[0_0_40px_rgba(96,165,250,0.3)]' 
                : isRecording 
                  ? 'border-primary/30 bg-primary/5 shadow-[0_0_40px_rgba(195,226,186,0.3)]'
                  : 'border-white/5 bg-transparent'
            }`}
            style={{ width: '100%', height: '100%' }}
          ></div>
        ))}

        {/* Central Profile Image Container */}
        <div className={`relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-2 transition-all duration-700 z-10 backdrop-blur-sm ${
          callState === CallState.Incoming ? 'border-primary/50 animate-pulse shadow-[0_0_50px_rgba(195,226,186,0.4)]' :
          isRecording 
            ? 'border-primary shadow-[0_0_60px_rgba(195,226,186,0.5)]' 
            : isPlaying
              ? 'border-blue-400 shadow-[0_0_60px_rgba(96,165,250,0.5)]'
              : 'border-white/10 shadow-2xl'
        }`}>
          <img 
            src="/assets/images/Khansa.jpg" 
            alt="Khansa" 
            className="w-full h-full object-cover scale-105"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23c3e2ba"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
            }}
          />
          
          {/* Dark overlay for processing state */}
          <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all duration-500 ${isProcessing ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
             <div className="w-8 h-8 rounded-full border-2 border-t-white/80 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          </div>
        </div>
      </div>

      <div className="w-full flex-1 flex flex-col justify-end items-center pb-8 relative z-10 min-h-[150px]">
        {callState === CallState.Incoming ? (
          <div className="flex items-center space-x-16 mt-auto">
            <div className="flex flex-col items-center space-y-3">
              <button
                onClick={rejectCall}
                className="w-16 h-16 rounded-full bg-[#3a1c1c]/80 backdrop-blur-md text-red-400 border border-red-500/30 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-[0_0_30px_rgba(239,68,68,0.2)] hover:shadow-[0_0_40px_rgba(239,68,68,0.5)] transform hover:scale-105 active:scale-95"
                title="Decline"
              >
                <PhoneIcon className="w-7 h-7 rotate-[135deg]" />
              </button>
              <span className="text-white/40 text-[10px] tracking-widest uppercase font-light">Decline</span>
            </div>
            <div className="flex flex-col items-center space-y-3">
              <button
                onClick={acceptCall}
                className="w-16 h-16 rounded-full bg-[#1c3a26]/80 backdrop-blur-md text-green-400 border border-green-500/30 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all shadow-[0_0_30px_rgba(34,197,94,0.2)] hover:shadow-[0_0_40px_rgba(34,197,94,0.5)] transform hover:scale-105 active:scale-95 animate-bounce"
                title="Accept"
              >
                <PhoneIcon className="w-7 h-7" />
              </button>
              <span className="text-white/40 text-[10px] tracking-widest uppercase font-light">Accept</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-end w-full h-full">
            {/* Live Subtitles Area */}
            <div className="flex-1 w-full max-w-lg px-4 text-center flex flex-col justify-end mb-8">
              {isRecording && liveUserText && (
                 <p className="text-white/90 font-light text-xl md:text-2xl tracking-wide transition-all duration-500 ease-in-out drop-shadow-md">
                   "{liveUserText}"
                 </p>
              )}
              {isPlaying && aiText && (
                 <p className="text-primary/90 font-light text-xl md:text-2xl tracking-wide transition-all duration-500 ease-in-out drop-shadow-md">
                   "{aiText}"
                 </p>
              )}
            </div>

            <button
              onClick={endCall}
              className="w-16 h-16 rounded-full bg-[#3a1c1c]/80 backdrop-blur-md text-red-400 border border-red-500/30 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-[0_0_30px_rgba(239,68,68,0.2)] hover:shadow-[0_0_40px_rgba(239,68,68,0.5)] transform hover:scale-105 active:scale-95"
              title="End Call"
            >
              <PhoneIcon className="w-7 h-7 rotate-[135deg]" />
            </button>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Session;
