import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import PageLayout from '../components/PageLayout';

const EndSession = () => {
  const navigate = useNavigate();
  const [profileName, setProfileName] = useState('Sajid');

  useEffect(() => {
    const name = localStorage.getItem('profileName');
    if (name) {
      setProfileName(name);
    }
  }, []);

  return (
    <PageLayout innerClassName="gap-8 md:gap-12 pb-24 relative overflow-hidden">
      {/* Title */}
      <div className="text-center space-y-3 w-full mt-8 relative z-10">
        <h1 className="text-3xl md:text-4xl text-white font-light tracking-wide">
          Good night, {profileName}
        </h1>
        <p className="text-on-surface-variant font-light text-base md:text-lg opacity-85">
          May your night be calm and your dreams sweet.
        </p>
      </div>

      {/* Center Glass Card & Illustration */}
      <div className="relative w-80 h-80 flex items-center justify-center my-6 z-10">
        {/* Soft Ambient Background Glow */}
        <div className="absolute inset-4 rounded-full bg-primary/25 blur-3xl opacity-70 transition-all duration-700"></div>
        
        {/* Glassmorphic Frame */}
        <div 
          className="w-72 h-72 rounded-3xl backdrop-blur-md border-2 flex items-center justify-center relative z-10 transition-all duration-500 bg-slate-800/40 shadow-[0_0_30px_rgba(195,226,186,0.2)] border-primary/60 overflow-hidden"
        >
          {/* Drifting Clouds Background Layer */}
          <div className="absolute inset-0 pointer-events-none z-0">
            {/* Background Cloud 1 */}
            <div 
              className="absolute pointer-events-none opacity-[0.06] animate-cloud-pass z-0"
              style={{ top: '12%', animationDuration: '90s', animationDelay: '0s', transform: 'scale(1.2)' }}
            >
              <svg viewBox="0 0 120 60" className="w-56 h-28 text-white" fill="currentColor">
                <path d="M 25,60 a 20,20 0 0,1 29,-15 a 25,25 0 0,1 43,-5 a 20,20 0 0,1 25,20 a 15,15 0 0,1 -4,15 H 18 a 15,15 0 0,1 7,-15 z" />
              </svg>
            </div>
            {/* Background Cloud 2 */}
            <div 
              className="absolute pointer-events-none opacity-[0.04] animate-cloud-pass z-0"
              style={{ top: '30%', animationDuration: '120s', animationDelay: '-40s', transform: 'scale(0.8)' }}
            >
              <svg viewBox="0 0 120 60" className="w-40 h-20 text-white" fill="currentColor">
                <path d="M 25,60 a 20,20 0 0,1 29,-15 a 25,25 0 0,1 43,-5 a 20,20 0 0,1 25,20 a 15,15 0 0,1 -4,15 H 18 a 15,15 0 0,1 7,-15 z" />
              </svg>
            </div>
            {/* Foreground Cloud 1 */}
            <div 
              className="absolute pointer-events-none opacity-[0.08] animate-cloud-pass z-20"
              style={{ top: '48%', animationDuration: '75s', animationDelay: '-20s', transform: 'scale(1.0)' }}
            >
              <svg viewBox="0 0 120 60" className="w-48 h-24 text-white" fill="currentColor">
                <path d="M 25,60 a 20,20 0 0,1 29,-15 a 25,25 0 0,1 43,-5 a 20,20 0 0,1 25,20 a 15,15 0 0,1 -4,15 H 18 a 15,15 0 0,1 7,-15 z" />
              </svg>
            </div>
            {/* Foreground Cloud 2 */}
            <div 
              className="absolute pointer-events-none opacity-[0.05] animate-cloud-pass z-20"
              style={{ top: '70%', animationDuration: '140s', animationDelay: '-70s', transform: 'scale(1.4)' }}
            >
              <svg viewBox="0 0 120 60" className="w-64 h-32 text-white" fill="currentColor">
                <path d="M 25,60 a 20,20 0 0,1 29,-15 a 25,25 0 0,1 43,-5 a 20,20 0 0,1 25,20 a 15,15 0 0,1 -4,15 H 18 a 15,15 0 0,1 7,-15 z" />
              </svg>
            </div>
          </div>

          {/* Minimalist Glowing Crescent Moon */}
          <div className="relative flex items-center justify-center z-10">
            {/* Soft Cozy Ambient Glow */}
            <div className="absolute w-44 h-44 rounded-full bg-yellow-500/10 blur-3xl opacity-50 animate-breathing-glow"></div>
            
            <svg 
              viewBox="0 0 100 100" 
              className="w-24 h-24 text-yellow-100/90 drop-shadow-[0_0_30px_rgba(253,224,71,0.4)] animate-rock-moon relative z-10" 
              fill="currentColor"
            >
              <path d="M58 22 A30 30 0 1 0 78 58 A24 24 0 1 1 58 22 Z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Text and Action Button */}
      <div className="w-full flex flex-col items-center space-y-8 mt-2 relative z-10">
        <p className="text-white/70 font-light text-center leading-relaxed text-sm md:text-base tracking-wide">
          I will be here to accompany you<br/>tomorrow night.
        </p>
        
        <button
          onClick={() => navigate('/')}
          className="px-10 py-4 rounded-full bg-[#1e2a22] hover:bg-[#25362a] border border-primary/20 text-white hover:text-primary font-medium transition-all shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-95 duration-300 tracking-wider text-sm uppercase"
        >
          Finish
        </button>
      </div>
    </PageLayout>
  );
};

export default EndSession;
