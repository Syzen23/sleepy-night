import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SparklesIcon, MoonIcon, Cog8ToothIcon } from '@heroicons/react/24/outline';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import PageLayout from '../components/PageLayout';



const Home = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<{ name: string; bedtime: string } | null>(null);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/user/profile`);
        const result = await response.json();
        if (result.success && result.data) {
          setProfile(result.data);
          localStorage.setItem('profileName', result.data.name);
          localStorage.setItem('bedtimeReminder', result.data.bedtime);
        }
      } catch (e) {
        console.warn('Failed to fetch profile from DB, falling back to local storage:', e);
        const cachedName = localStorage.getItem('profileName') || 'Sajid';
        const cachedBedtime = localStorage.getItem('bedtimeReminder') || '22:00';
        setProfile({ name: cachedName, bedtime: cachedBedtime });
      }
    };
    fetchProfile();
  }, []);

  useGSAP(() => {
    gsap.from(mainRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
  }, { scope: mainRef });

  const startSession = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/sessions`, {
        method: 'POST'
      });
      const data = await response.json();
      if (data.sessionId) {
        navigate('/session', { state: { sessionId: data.sessionId } });
      }
    } catch (error) {
      console.error('Failed to start session', error);
      navigate('/session', { state: { sessionId: 1 } });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);

      if (profile) {
        const [btHours, btMinutes] = profile.bedtime.split(':').map(Number);
        if (now.getHours() === btHours && now.getMinutes() === btMinutes && now.getSeconds() === 0) {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Night Companion', {
              body: `Halo ${profile.name}, sudah waktunya memperlambat hari ini. Aku ada di sini kalau kamu ingin berbicara sebentar.`,
            });
          }
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [profile]);

  const formattedTime = time.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <PageLayout 
      disableScroll={true}
      maxWidthClass="max-w-7xl"
      backgroundElement={
        <div className="absolute inset-0 z-0 bg-background">
          <img 
            alt="Serene mountain landscape" 
            className="w-full h-full object-cover opacity-70" 
            src="/assets/images/mountain_bg.png"
          />
          {/* Theme color tint overlay for the mountain */}
          <div className="absolute inset-0 bg-[var(--mountain-overlay)] mix-blend-color pointer-events-none"></div>

          {/* Charcoal/Forest Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-transparent"></div>
        </div>
      }
    >



      {/* Main Content Canvas */}
      <main ref={mainRef} className="relative z-20 flex flex-col items-center justify-between h-full flex-1 w-full px-4 md:px-8 pt-24 pb-28 md:max-w-7xl md:mx-auto">
        {/* Top App Bar */}
        <header className="w-full px-8 pt-6 flex justify-between items-center fixed top-0 left-0 right-0 max-w-7xl mx-auto z-30">
          <div className="flex items-center gap-2">
            <MoonIcon className="text-primary w-7 h-7" />
            <span className="text-2xl font-light tracking-widest text-primary uppercase">Night Haven</span>
          </div>
          <button onClick={() => navigate("/profile")} className="w-12 h-12 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity bg-surface-variant/20 backdrop-blur-md border border-white/5">
            <Cog8ToothIcon className="text-on-surface-variant w-6 h-6" />
          </button>
        </header>

        {/* Time Display */}
        <div className="w-full flex justify-center opacity-80 hover:opacity-100 transition-opacity duration-500 mt-4 md:mt-12">
          <h2 className="text-5xl md:text-6xl text-on-surface-variant tracking-widest font-light">
            {formattedTime.replace('.', ':')}
          </h2>
        </div>

        {/* Center Content Area */}
        <div className="flex flex-col items-center text-center max-w-xl mx-auto">
          {/* Greeting Sequence */}
          <div className="space-y-3 mb-12">
            <h1 className="text-4xl md:text-5xl text-white font-light tracking-tight drop-shadow-lg">
              Good evening, {profile?.name || 'Sajid'}
            </h1>
            <p className="text-lg text-primary/80 font-light tracking-wide max-w-md mx-auto">
              Let’s close your day together.
            </p>
          </div>

          {/* Primary AI Interaction Button */}
          <button 
            onClick={() => navigate('/mood')}
            className="group relative flex items-center gap-4 px-10 py-5 rounded-full bg-[#FFFFFF05] backdrop-blur-[20px] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:bg-[#FFFFFF0A] transition-all duration-500 ease-out transform hover:-translate-y-1 glow-bloom disabled:opacity-50"
          >
            {/* Inner Glow Ring */}
            <div className="absolute inset-0 rounded-full border border-primary/20 group-hover:border-primary/40 transition-colors duration-500"></div>
            {/* Icon */}
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-[0_0_15px_rgba(195,226,186,0.4)] group-hover:shadow-[0_0_25px_rgba(195,226,186,0.6)] transition-shadow duration-500">
              <SparklesIcon className="w-5 h-5 text-on-primary" />
            </div>
            {/* Text */}
            <span className="text-sm font-medium text-white tracking-widest uppercase opacity-90 group-hover:opacity-100 group-hover:text-primary transition-colors duration-300">
              {isLoading ? "Starting..." : "I'm ready to talk"}
            </span>
          </button>

          {/* Developer Credit */}
          <p className="mt-8 text-xs text-on-surface-variant/60 font-light tracking-widest uppercase">
            Developed by Sajid
          </p>
        </div>
      </main>
    </PageLayout>
  );
};

export default Home;
