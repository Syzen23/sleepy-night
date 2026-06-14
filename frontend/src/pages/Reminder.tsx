import { useNavigate } from 'react-router-dom';
import { SparklesIcon } from '@heroicons/react/24/solid';

const Reminder = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-between p-8 relative bg-background text-on-background font-body-md overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0 bg-background pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto text-center mt-24 space-y-4">
        <h1 className="text-3xl md:text-4xl text-white font-light tracking-wide">
          It's almost time<br/>to rest
        </h1>
        <p className="text-on-surface-variant font-light text-lg">
          You've done enough today.
        </p>
      </div>

      {/* Center Illustration - Moon */}
      <div className="relative z-10 w-64 h-64 flex items-center justify-center my-auto">
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl"></div>
        <div className="absolute inset-4 rounded-full border border-primary/10"></div>
        
        {/* Moon Shape */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#d3e2cb] to-[#e8f1e3] shadow-[0_0_40px_rgba(195,226,186,0.3)] relative z-10 overflow-hidden flex flex-col items-center justify-center">
          {/* Moon shading */}
          <div className="absolute top-0 right-0 w-full h-full bg-black/10 rounded-full ml-8"></div>
          {/* Sleeping Face */}
          <div className="relative z-20 flex space-x-6 mb-2">
            {/* Closed Eye */}
            <svg width="18" height="10" viewBox="0 0 18 10" fill="none" className="text-[#2a3c2f]">
              <path d="M2 2C2 2 5 8 9 8C13 8 16 2 16 2" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            <svg width="18" height="10" viewBox="0 0 18 10" fill="none" className="text-[#2a3c2f]">
              <path d="M2 2C2 2 5 8 9 8C13 8 16 2 16 2" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="relative z-20 w-3 h-1.5 bg-[#2a3c2f] rounded-full mt-1"></div>
        </div>
        
        {/* Floating Sparkles */}
        <SparklesIcon className="absolute top-8 left-16 w-5 h-5 text-primary/70 animate-pulse" style={{ animationDelay: '0s' }} />
        <SparklesIcon className="absolute top-12 right-12 w-4 h-4 text-primary/60 animate-pulse" style={{ animationDelay: '1s' }} />
        <SparklesIcon className="absolute bottom-16 right-16 w-3 h-3 text-primary/80 animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Bottom Content */}
      <div className="relative z-10 w-full max-w-md mx-auto mb-12 flex flex-col items-center space-y-8">
        <p className="text-white/80 font-light text-center leading-relaxed">
          The rest can wait until<br/>tomorrow.
        </p>
        <button
          onClick={() => navigate('/')}
          className="w-full max-w-xs px-8 py-4 rounded-full bg-[#1e2a22] hover:bg-[#25362a] border border-primary/20 text-white font-medium transition-all shadow-lg hover:shadow-primary/10 flex justify-center items-center space-x-2"
        >
          <span>Okay, good night</span>
          <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.5 3c-4.5 0-8 3-10.5 7A11.4 11.4 0 003 18.5a1 1 0 001.5 1 12.3 12.3 0 005.5-2.5c4-2.5 7-6 7-10.5V3h-4.5zM12 11c-1.5 2-3.5 3.5-5.5 4.5A9.5 9.5 0 018.5 10c2-3 4.5-5 7.5-5a7.5 7.5 0 01-4 6z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Reminder;
