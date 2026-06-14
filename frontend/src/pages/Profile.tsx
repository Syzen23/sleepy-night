import { useState, useRef, useEffect } from 'react';
import BottomNav from '../components/BottomNav';
import PageLayout from '../components/PageLayout';
import { AdjustmentsHorizontalIcon, BellAlertIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  
  const [name, setName] = useState(() => localStorage.getItem('profileName') || 'Sajid');
  const [tempName, setTempName] = useState(() => localStorage.getItem('profileName') || 'Sajid');
  const [isEditingName, setIsEditingName] = useState(false);
  const [reminderTime, setReminderTime] = useState(() => localStorage.getItem('bedtimeReminder') || '22:00');
  const [tempBedtime, setTempBedtime] = useState(() => localStorage.getItem('bedtimeReminder') || '22:00');
  const [isEditingBedtime, setIsEditingBedtime] = useState(false);
  const [voice, setVoice] = useState(() => localStorage.getItem('appVoice') || 'Tessa (Momy)');
  const [voiceProvider, setVoiceProvider] = useState(() => localStorage.getItem('voiceProvider') || 'Cartesia');

  const timeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/user/profile`);
        const result = await response.json();
        if (result.success && result.data) {
          const u = result.data;
          setName(u.name);
          setTempName(u.name);
          setReminderTime(u.bedtime);
          setTempBedtime(u.bedtime);
          
          // Map legacy voice setting names if present
          let mappedVoice = u.voice;
          if (mappedVoice === 'Calm' || mappedVoice === 'Tessa') mappedVoice = 'Tessa (Momy)';
          if (mappedVoice === 'Soft' || mappedVoice === 'Ariana') mappedVoice = 'Ariana (Young)';
          if (mappedVoice === 'Warm' || mappedVoice === 'Carson' || mappedVoice === 'Kira') mappedVoice = 'Kira (Confidant)';
          setVoice(mappedVoice);
          
          const mappedProvider = u.voiceProvider || 'Cartesia';
          setVoiceProvider(mappedProvider);
          
          localStorage.setItem('profileName', u.name);
          localStorage.setItem('bedtimeReminder', u.bedtime);
          localStorage.setItem('appVoice', mappedVoice);
          localStorage.setItem('voiceProvider', mappedProvider);
        }
      } catch (e) {
        console.warn('Failed to load profile from DB:', e);
        setName(localStorage.getItem('profileName') || 'Sajid');
        setTempName(localStorage.getItem('profileName') || 'Sajid');
        setReminderTime(localStorage.getItem('bedtimeReminder') || '22:00');
        setTempBedtime(localStorage.getItem('bedtimeReminder') || '22:00');
        
        let mappedVoice = localStorage.getItem('appVoice') || 'Tessa (Momy)';
        if (mappedVoice === 'Calm' || mappedVoice === 'Tessa') mappedVoice = 'Tessa (Momy)';
        if (mappedVoice === 'Soft' || mappedVoice === 'Ariana') mappedVoice = 'Ariana (Young)';
        if (mappedVoice === 'Warm' || mappedVoice === 'Carson' || mappedVoice === 'Kira') mappedVoice = 'Kira (Confidant)';
        setVoice(mappedVoice);
        
        const mappedProvider = localStorage.getItem('voiceProvider') || 'Cartesia';
        setVoiceProvider(mappedProvider);
      }
    };
    fetchProfile();
  }, []);

  const saveProfile = async (updates: Partial<{ name: string; bedtime: string; voice: string; voiceProvider: string }>) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/user/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch (e) {
      console.error('Failed to save profile updates to DB:', e);
    }
  };

  const saveName = async () => {
    setIsEditingName(false);
    const cleaned = tempName.trim();
    if (!cleaned) {
      setTempName(name);
      return;
    }
    setName(cleaned);
    localStorage.setItem('profileName', cleaned);
    await saveProfile({ name: cleaned });
  };

  const saveBedtime = async () => {
    setIsEditingBedtime(false);
    if (!tempBedtime) {
      setTempBedtime(reminderTime);
      return;
    }
    setReminderTime(tempBedtime);
    localStorage.setItem('bedtimeReminder', tempBedtime);
    await saveProfile({ bedtime: tempBedtime });
  };

  const handleReminderClick = () => {
    if (timeInputRef.current) {
      try {
        if ('showPicker' in timeInputRef.current) {
          timeInputRef.current.showPicker();
        } else {
          timeInputRef.current.focus();
        }
      } catch (e) {
        timeInputRef.current.focus();
      }
    }
  };

  return (
    <>
    <PageLayout disableScroll={true}>
      <div className="w-full max-w-md mx-auto space-y-8">
        <div className="text-center space-y-2 relative">
          <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(195,226,186,0.15)] overflow-hidden border-2 border-primary/20">
            <img src="/assets/images/me.jpg" alt="Profile Avatar" className="w-full h-full object-cover" />
          </div>
          
          <div className="relative inline-block">
            {isEditingName ? (
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={saveName}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveName();
                }}
                className="text-2xl text-white font-medium tracking-wide bg-[#1e2a22] border border-primary/20 rounded-xl px-3 py-1 text-center focus:outline-none focus:border-primary max-w-xs mx-auto block"
                autoFocus
              />
            ) : (
              <h1 
                onClick={() => setIsEditingName(true)}
                className="text-2xl text-white font-medium tracking-wide cursor-pointer hover:text-primary transition-colors flex items-center justify-center group relative px-8"
                title="Click to edit name"
              >
                {name}
                <span className="absolute right-0 text-xs text-primary/50 opacity-0 group-hover:opacity-100 transition-opacity font-normal tracking-normal">(Edit)</span>
              </h1>
            )}
          </div>
          <p className="text-on-surface-variant font-light text-sm mt-1">Sleep</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg text-white/80 font-light px-4">Preferences</h2>
          
          <div className="bg-[#1a231c]/40 rounded-3xl p-2 space-y-2 border border-primary/5">
            <div 
              className="flex items-center justify-between p-4 rounded-2xl hover:bg-[#1e2a22] transition-colors group relative"
            >
              <div className="flex items-center space-x-4">
                <BellAlertIcon className="w-6 h-6 text-primary/70 group-hover:text-primary transition-colors" />
                <span className="text-on-surface-variant group-hover:text-white transition-colors font-light">Bedtime Reminder</span>
              </div>
              
              {isEditingBedtime ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="time"
                    value={tempBedtime}
                    onChange={(e) => setTempBedtime(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveBedtime();
                    }}
                    className="text-sm text-white bg-[#1a231c] px-2 py-1.5 rounded-lg border border-primary/30 focus:outline-none focus:border-primary"
                    autoFocus
                  />
                  <button 
                    onClick={saveBedtime}
                    className="px-3 py-1.5 text-xs font-medium bg-primary/20 text-primary rounded-lg hover:bg-primary/40 transition-colors border border-primary/10"
                  >
                    OK
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => {
                    setTempBedtime(reminderTime);
                    setIsEditingBedtime(true);
                  }}
                  className="text-sm text-primary bg-[#1e2a22]/50 px-3 py-1.5 rounded-lg group-hover:bg-[#25362a] transition-colors border border-primary/10 cursor-pointer"
                  title="Click to edit"
                >
                  {reminderTime}
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-[#1e2a22] transition-colors group relative">
              <div className="flex items-center space-x-4">
                <AdjustmentsHorizontalIcon className="w-6 h-6 text-primary/70 group-hover:text-primary transition-colors" />
                <span className="text-on-surface-variant group-hover:text-white transition-colors font-light">AI Voice Provider</span>
              </div>
              <select
                value={voiceProvider}
                onChange={async (e) => {
                  const newProvider = e.target.value;
                  setVoiceProvider(newProvider);
                  localStorage.setItem('voiceProvider', newProvider);
                  
                  // Reset voice when provider changes
                  const defaultVoice = newProvider === 'Hume AI' ? 'Chinta' : 'Tessa (Momy)';
                  setVoice(defaultVoice);
                  localStorage.setItem('appVoice', defaultVoice);
                  
                  await saveProfile({ voiceProvider: newProvider, voice: defaultVoice });
                }}
                className="text-sm text-primary bg-[#1e2a22]/50 px-3 py-1.5 rounded-lg border border-primary/10 focus:outline-none cursor-pointer"
              >
                <option value="Cartesia">Cartesia</option>
                <option value="Hume AI">Hume AI</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-[#1e2a22] transition-colors group relative">
              <div className="flex items-center space-x-4">
                <AdjustmentsHorizontalIcon className="w-6 h-6 text-primary/70 group-hover:text-primary transition-colors opacity-0" />
                <span className="text-on-surface-variant group-hover:text-white transition-colors font-light">Voice Model</span>
              </div>
              <select
                value={voice}
                onChange={async (e) => {
                  const newVoice = e.target.value;
                  setVoice(newVoice);
                  localStorage.setItem('appVoice', newVoice);
                  await saveProfile({ voice: newVoice });
                }}
                className="text-sm text-primary bg-[#1e2a22]/50 px-3 py-1.5 rounded-lg border border-primary/10 focus:outline-none cursor-pointer"
              >
                {voiceProvider === 'Cartesia' ? (
                  <>
                    <option value="Tessa (Momy)">Tessa (Momy)</option>
                    <option value="Ariana (Young)">Ariana (Young)</option>
                    <option value="Kira (Confidant)">Kira (Confidant)</option>
                  </>
                ) : (
                  <>
                    <option value="Chinta">Chinta</option>
                    <option value="Miko">Miko</option>
                    <option value="Yura">Yura</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 pt-8">
          <p className="text-on-surface-variant/50 text-xs">Developed by Sajid</p>
        </div>
      </div>
    </PageLayout>
    <BottomNav />
    </>
  );
};

export default Profile;
