import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ReminderPopupProps {
  onDismiss: () => void;
}

const ReminderPopup: React.FC<ReminderPopupProps> = ({ onDismiss }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to trigger fade-in animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss();
      // Optionally navigate to closure or home
      // navigate('/closure'); 
    }, 500); // Wait for fade-out
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a100c] text-[#e8ebe9] transition-opacity duration-500 px-6 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Top Time Indicator (Optional, like in mockup) */}
      <div className="absolute top-6 left-6 text-sm font-light text-white/50 tracking-wider">
        {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
      </div>

      <div className="flex flex-col items-center text-center space-y-12 w-full max-w-sm mt-5">
        
        {/* Header Text */}
        <div className="flex flex-col items-center justify-center space-y-4 animate-fade-in-up px-4" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <h1 className="text-3xl font-medium tracking-wide text-[#f2f4f2] leading-snug">
            Take a moment<br />for yourself
          </h1>
          <p className="text-[#a0a8a3] font-light text-base px-2">
            Khansa is waiting for your stories tonight.
          </p>
        </div>

        {/* Cartoon Illustration */}
        <div className="relative w-56 h-56 flex items-center justify-center animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
          <img 
            src="/assets/images/cartoon/sleepy.png" 
            alt="Sleepy Khansa" 
            className="w-full h-full object-contain relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-500" 
          />
        </div>

        {/* Bottom Text */}
        <div className="flex flex-col items-center justify-center space-y-6 w-full animate-fade-in-up px-6" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
          <p className="text-[#c1c9c4] font-light text-base leading-relaxed text-center">
            Let's have a little chat before<br />you drift off to sleep.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col items-center justify-center space-y-3 w-full max-w-[240px] mx-auto">
            <button 
              onClick={() => {
                handleDismiss();
                navigate('/session');
              }}
              className="w-full py-3.5 flex justify-center items-center rounded-full bg-[#1b2b20] hover:bg-[#233829] text-[#d9e0db] border border-[#2a4031] font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(27,43,32,0.4)]"
            >
              Talk to Khansa ✨
            </button>
            <button 
              onClick={handleDismiss}
              className="w-full py-3.5 flex justify-center items-center rounded-full bg-transparent hover:bg-white/5 text-[#a0a8a3] hover:text-white border border-transparent font-light transition-all duration-300"
            >
              Maybe later
            </button>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 1.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ReminderPopup;
