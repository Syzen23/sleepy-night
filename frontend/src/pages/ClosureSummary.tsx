import { useState, useRef, useEffect } from 'react';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SparklesIcon } from '@heroicons/react/24/solid';

import PageLayout from '../components/PageLayout';

const SnowParticles = React.memo(() => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(40)].map((_, i) => (
        <div 
          key={i} 
          className="absolute bg-blue-100 rounded-full opacity-60"
          style={{
            width: Math.random() * 4 + 2 + 'px',
            height: Math.random() * 4 + 2 + 'px',
            top: -10,
            left: Math.random() * 100 + '%',
            // Random duration between 8s (fast) and 28s (slow)
            animation: `fall ${Math.random() * 20 + 8}s linear infinite`,
            animationDelay: `-${Math.random() * 15}s`
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10px) translateX(0px); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateY(100vh) translateX(${Math.random() * 50 - 25}px); opacity: 0; }
        }
      `}</style>
    </div>
  );
});

const WindParticles = React.memo(() => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div 
          key={i} 
          className="absolute bg-teal-200/40 rounded-full blur-[1px]"
          style={{
            width: Math.random() * 100 + 50 + 'px',
            height: '2px',
            top: Math.random() * 100 + '%',
            left: '-100px',
            animation: `wind ${Math.random() * 3 + 2}s linear infinite`,
            animationDelay: `-${Math.random() * 3}s`
          }}
        />
      ))}
      <style>{`
        @keyframes wind {
          0% { transform: translateX(-100px); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { transform: translateX(100vw); opacity: 0; }
        }
      `}</style>
    </div>
  );
});

const EmbersParticles = React.memo(() => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(30)].map((_, i) => (
        <div 
          key={i} 
          className="absolute bg-orange-300 rounded-full blur-[1px]"
          style={{
            width: Math.random() * 4 + 2 + 'px',
            height: Math.random() * 4 + 2 + 'px',
            bottom: -10,
            left: Math.random() * 100 + '%',
            animation: `floatUp ${Math.random() * 6 + 4}s ease-in infinite`,
            animationDelay: `-${Math.random() * 5}s`
          }}
        />
      ))}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(10px) translateX(0px) scale(0.5); opacity: 0; }
          20% { opacity: 0.8; transform: translateY(-20vh) translateX(${Math.random() * 20 - 10}px) scale(1); }
          100% { transform: translateY(-100vh) translateX(${Math.random() * 50 - 25}px) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
});

const ClosureSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const summaryData = location.state?.summary || null;
  const theme = summaryData?.theme || 'coffee';

  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [shine, setShine] = useState({ x: 50, y: 50, show: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Max tilt: 15 degrees
    const rotateX = ((centerY - y) / centerY) * 15;
    const rotateY = ((x - centerX) / centerX) * 15;
    
    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    setTilt({ x: rotateX, y: rotateY });
    setShine({ x: percentX, y: percentY, show: true });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setShine(prev => ({ ...prev, show: false }));
  };

  let glowColor = "bg-primary/20 shadow-[0_0_50px_rgba(195,226,186,0.4)] border-primary/25";
  let backgroundElem = <EmbersParticles />;
  let gradientFrom = "from-primary/10";

  if (theme === 'snow') {
    glowColor = "bg-blue-400/15 shadow-[0_0_50px_rgba(147,197,253,0.35)] border-blue-400/20";
    backgroundElem = <SnowParticles />;
    gradientFrom = "from-blue-500/10";
  } else if (theme === 'wind') {
    glowColor = "bg-teal-500/15 shadow-[0_0_50px_rgba(45,212,191,0.35)] border-teal-500/20";
    backgroundElem = <WindParticles />;
    gradientFrom = "from-teal-500/10";
  }

  return (
    <PageLayout innerClassName="gap-8 md:gap-12 pb-20" backgroundElement={backgroundElem} gradientFrom={gradientFrom}>
      <div className="text-center space-y-3 w-full mt-4">
        <h1 className="text-3xl md:text-4xl text-white font-light tracking-wide leading-snug">
          Here's your<br/>night summary
        </h1>
        <p className="text-on-surface-variant font-light text-base md:text-lg opacity-85">
          Let's close your day.
        </p>
      </div>

      {/* Center Glass Card & Illustration */}
      <div className="relative w-80 h-80 flex items-center justify-center my-6">
        {/* Soft Ambient Background Glow */}
        <div className={`absolute inset-4 rounded-full blur-3xl opacity-70 transition-all duration-700 ${
          theme === 'snow' ? 'bg-blue-400/25' : theme === 'wind' ? 'bg-teal-400/25' : 'bg-primary/25'
        }`}></div>
        
        {/* Glassmorphic Frame */}
        <div 
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: 'transform 0.1s ease-out',
            transformStyle: 'preserve-3d',
          }}
          className={`w-72 h-72 rounded-3xl backdrop-blur-md border flex items-center justify-center p-3 relative z-10 transition-all duration-500 bg-[#FFFFFF02] cursor-pointer ${glowColor}`}
        >
          <img 
            src={`/assets/images/${theme}.png`} 
            alt="Night Theme" 
            className="w-full h-full rounded-2xl object-cover shadow-inner pointer-events-none select-none"
            loading="lazy"
            style={{
              transform: 'translateZ(30px)',
              transition: 'transform 0.1s ease-out'
            }}
          />
          
          {/* Shimmer / Shine Overlay */}
          <div 
            className={`absolute inset-0 pointer-events-none z-20 mix-blend-overlay rounded-2xl transition-opacity duration-300 ${shine.show ? 'opacity-30' : 'opacity-0'}`}
            style={{
              background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255, 255, 255, 0.8) 0%, transparent 60%)`,
            }}
          />
        </div>

        
      </div>

      {/* Theme Explanation */}
      <div className="text-center space-y-2 px-6 w-full max-w-sm mt-2 mb-6">
        <h2 className={`text-xl font-medium tracking-wide ${theme === 'snow' ? 'text-blue-300' : theme === 'wind' ? 'text-teal-300' : 'text-primary'}`}>
          {theme === 'snow' ? 'Snow & Silence' : theme === 'wind' ? 'Wind & Whispers' : 'Coffee & Comfort'}
        </h2>
        <p className="text-sm text-white/70 font-light leading-relaxed">
          {theme === 'snow' 
            ? 'Your night feels quiet and reflective. This image captures the deep, calm silence we shared.' 
            : theme === 'wind' 
            ? 'Your mind was active tonight. This image represents letting your worries flow freely with the wind.' 
            : 'A warm, comforting session. This image captures the intimate, friendly atmosphere of our conversation.'}
        </p>
      </div>

      {/* Bottom Button */}
      <div className="w-full flex justify-center mt-2">
        <button
          onClick={() => navigate('/summary', { state: { summary: summaryData } })}
          className="w-full max-w-xs flex items-center justify-center space-x-2 px-8 py-4 rounded-full bg-[#1e2a22] hover:bg-[#25362a] border border-primary/20 text-white font-medium transition-all shadow-lg hover:shadow-primary/15 hover:scale-[1.02] active:scale-95 duration-300"
        >
          <span>Show Summary</span>
          <SparklesIcon className="w-4 h-4 text-primary" />
        </button>
      </div>
    </PageLayout>
  );
};

export default ClosureSummary;
