import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import PageLayout from '../components/PageLayout';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const MOODS = [
  { 
    label: "Happy", 
    image: "/assets/images/cartoon/happy.png",
    face: <svg viewBox="0 0 24 24" fill="none" className="w-full h-full"><circle cx="8" cy="10" r="1.5" fill="currentColor"/><circle cx="16" cy="10" r="1.5" fill="currentColor"/><path d="M7 14c1.5 2 4.5 2 10 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> 
  },
  { 
    label: "Calm", 
    image: "/assets/images/cartoon/calm.png",
    face: <svg viewBox="0 0 24 24" fill="none" className="w-full h-full"><path d="M6 10c1-1 3-1 4 0M14 10c1-1 3-1 4 0M8 15c1.5 1 4.5 1 8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> 
  },
  { 
    label: "Neutral", 
    image: "/assets/images/cartoon/confident.png",
    face: <svg viewBox="0 0 24 24" fill="none" className="w-full h-full"><circle cx="8" cy="10" r="1.5" fill="currentColor"/><circle cx="16" cy="10" r="1.5" fill="currentColor"/><path d="M8 15h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> 
  },
  { 
    label: "Sad", 
    image: "/assets/images/cartoon/sad.png",
    face: <svg viewBox="0 0 24 24" fill="none" className="w-full h-full"><circle cx="8" cy="10" r="1.5" fill="currentColor"/><circle cx="16" cy="10" r="1.5" fill="currentColor"/><path d="M8 16c1.5-1.5 4.5-1.5 8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> 
  },
  { 
    label: "Anxious", 
    image: "/assets/images/cartoon/worried.png",
    face: <svg viewBox="0 0 24 24" fill="none" className="w-full h-full"><circle cx="8" cy="9" r="1.5" fill="currentColor"/><circle cx="16" cy="9" r="1.5" fill="currentColor"/><path d="M7 16l2-2 3 2 3-2 2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> 
  },
  { 
    label: "Overthinking", 
    image: "/assets/images/cartoon/ovt.png",
    face: <svg viewBox="0 0 24 24" fill="none" className="w-full h-full"><path d="M5 9c1-1 3 1 4 0M15 9c1-1 3 1 4 0M7 15c2 1 4-1 6 1s4-1 4-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> 
  },
  { 
    label: "Tired", 
    image: "/assets/images/cartoon/sad.png",
    face: <svg viewBox="0 0 24 24" fill="none" className="w-full h-full"><path d="M6 10h4M14 10h4M9 15h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> 
  },
  { 
    label: "Excited", 
    image: "/assets/images/cartoon/spirit.png",
    face: <svg viewBox="0 0 24 24" fill="none" className="w-full h-full"><path d="M6 10L8 8L10 10M14 10L16 8L18 10M7 14c1.5 3 4.5 3 10 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> 
  }
];

const Mood = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<number>(2);
  const imgRef = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    if (imgRef.current) {
      gsap.fromTo(imgRef.current, 
        { scale: 0.8, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.5)", overwrite: true }
      );
    }
  }, [selectedMood]);

  const radius = 110;
  const moodCount = MOODS.length;
  
  return (
    <PageLayout innerClassName="gap-10 md:gap-12 relative pt-12 md:pt-8">
      <div className="text-center space-y-3 w-full">
        <h1 className="text-3xl md:text-4xl text-white font-light tracking-wide">
          How are you feeling<br/>tonight?
        </h1>
        <p className="text-on-surface-variant font-light text-lg">
          There's no right or wrong.
        </p>
      </div>

      {/* Breathable Layout: Face on top, 2-column grid below */}
      <div className="w-full flex flex-col items-center justify-center gap-8 md:gap-10">
        
        {/* Center Large Face */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="w-48 h-48 md:w-64 md:h-64 flex items-center justify-center relative z-20 transition-all duration-500">
            <img 
              ref={imgRef}
              src={MOODS[selectedMood].image} 
              alt={MOODS[selectedMood].label}
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>
          
          <div className="mt-6 text-primary font-medium tracking-widest uppercase text-sm md:text-lg drop-shadow-sm">
            {MOODS[selectedMood].label}
          </div>
        </div>

        {/* 2x4 Grid of Mood Selectors */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 w-full">
          {MOODS.map((mood, i) => {
            const isActive = selectedMood === i;
            return (
              <button
                key={i}
                onClick={() => setSelectedMood(i)}
                className={`flex items-center space-x-3 px-4 py-3 md:px-5 md:py-4 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-[#d3e2cb] text-[#2a3c2f] shadow-[0_10px_20px_rgba(195,226,186,0.2)] scale-[1.02] border-transparent' 
                    : 'bg-surface-variant/40 text-primary/70 hover:text-primary hover:bg-surface-variant/60 border border-primary/5'
                }`}
              >
                <div className="w-5 h-5 shrink-0">
                  {mood.face}
                </div>
                <span className={`text-sm tracking-wide ${isActive ? 'font-medium' : 'font-light'}`}>
                  {mood.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="w-full flex flex-col items-center justify-center mt-2 space-y-4">
        <button
          onClick={() => navigate('/session', { state: { mood: MOODS[selectedMood].label } })}
          className="w-full max-w-xs px-8 py-4 rounded-full bg-[#1e2a22] hover:bg-[#25362a] border border-primary/20 text-white font-medium transition-all shadow-lg hover:shadow-primary/10"
        >
          Continue
        </button>
        <button
          onClick={() => navigate(-1)}
          className="text-on-surface-variant hover:text-white text-sm tracking-wide transition-colors"
        >
          Cancel
        </button>
      </div>
    </PageLayout>
  );
};

export default Mood;
