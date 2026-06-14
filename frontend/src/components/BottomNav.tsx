import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, ChatBubbleBottomCenterTextIcon, UserIcon } from '@heroicons/react/24/outline';

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-sm rounded-full backdrop-blur-xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.3)] bg-surface-variant/10 z-50 overflow-hidden">
      <ul className="flex justify-between items-center p-1.5 relative">
        <li className="relative z-10 flex-1">
          <Link 
            to="/" 
            className={`flex flex-col items-center justify-center rounded-full py-2.5 mx-0.5 transition-all duration-200 group ${location.pathname === '/' ? 'bg-primary text-on-primary shadow-[0_0_20px_rgba(195,226,186,0.3)] scale-100' : 'text-on-surface-variant hover:text-primary scale-95 active:scale-90'}`}
          >
            <HomeIcon className={`w-5 h-5 mb-1 ${location.pathname !== '/' && 'group-hover:-translate-y-1 transition-transform duration-300'}`} />
            <span className={`text-[9px] font-medium tracking-widest uppercase ${location.pathname !== '/' ? 'opacity-70 group-hover:opacity-100 transition-opacity' : ''}`}>Home</span>
          </Link>
        </li>
        <li className="relative z-10 flex-1">
          <Link 
            to="/thoughts" 
            className={`flex flex-col items-center justify-center rounded-full py-2.5 mx-0.5 transition-all duration-200 group ${location.pathname === '/thoughts' ? 'bg-primary text-on-primary shadow-[0_0_20px_rgba(195,226,186,0.3)] scale-100' : 'text-on-surface-variant hover:text-primary scale-95 active:scale-90'}`}
          >
            <ChatBubbleBottomCenterTextIcon className={`w-5 h-5 mb-1 ${location.pathname !== '/thoughts' && 'group-hover:-translate-y-1 transition-transform duration-300'}`} />
            <span className={`text-[9px] font-medium tracking-widest uppercase ${location.pathname !== '/thoughts' ? 'opacity-70 group-hover:opacity-100 transition-opacity' : ''}`}>Thoughts</span>
          </Link>
        </li>
        <li className="relative z-10 flex-1">
          <Link 
            to="/profile" 
            className={`flex flex-col items-center justify-center rounded-full py-2.5 mx-0.5 transition-all duration-200 group ${location.pathname === '/profile' ? 'bg-primary text-on-primary shadow-[0_0_20px_rgba(195,226,186,0.3)] scale-100' : 'text-on-surface-variant hover:text-primary scale-95 active:scale-90'}`}
          >
            <UserIcon className={`w-5 h-5 mb-1 ${location.pathname !== '/profile' && 'group-hover:-translate-y-1 transition-transform duration-300'}`} />
            <span className={`text-[9px] font-medium tracking-widest uppercase ${location.pathname !== '/profile' ? 'opacity-70 group-hover:opacity-100 transition-opacity' : ''}`}>Profile</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default BottomNav;
