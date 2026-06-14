import { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import { ChevronDownIcon, ChevronUpIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

type ThoughtRecord = {
  id: string;
  date: string;
  mood: string;
  snippet: string;
  summary: {
    today: string[];
    tomorrow: string[];
    letGo: string[];
  };
};

const loadThoughts = (): ThoughtRecord[] => {
  try {
    const stored = localStorage.getItem('thoughtsHistory');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to load thoughts:', e);
  }
  return [];
};

type SummaryItem = {
  point: string;
  feedback: string;
};

const normalizeItems = (items: any[]): SummaryItem[] => {
  if (!Array.isArray(items)) return [];
  return items.map(item => {
    if (typeof item === 'string') {
      return { point: item, feedback: 'Aku di sini untuk mendukungmu.' };
    }
    if (item && typeof item === 'object') {
      return {
        point: item.point || item.pikiran || item.text || item.content || item.summary || '',
        feedback: item.feedback || item.solusi || item.penjelasan || 'Aku di sini untuk mendukungmu.'
      };
    }
    return { point: String(item), feedback: 'Aku di sini untuk mendukungmu.' };
  });
};

const Thoughts = () => {
  const [thoughts, setThoughts] = useState<ThoughtRecord[]>(loadThoughts);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;

  const totalPages = Math.ceil(thoughts.length / ITEMS_PER_PAGE);
  const paginatedThoughts = thoughts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/history`);
        const result = await response.json();
        if (result.data) {
          const mapped: ThoughtRecord[] = result.data.map((s: any) => {
            const dateObj = new Date(s.createdAt);
            const dateStr = dateObj.toLocaleDateString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });
            return {
              id: s.id,
              date: dateStr,
              mood: s.mood || 'Calm',
              snippet: s.userTranscript || 'Sesi percakapan malam',
              summary: {
                today: s.summaryShared || [],
                tomorrow: s.summaryTomorrow || [],
                letGo: s.summaryLetGo || [],
              }
            };
          });
          setThoughts(mapped);
          localStorage.setItem('thoughtsHistory', JSON.stringify(mapped));
        }
      } catch (e) {
        console.warn('Failed to fetch thoughts from DB:', e);
      }
    };
    fetchHistory();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const handleLetGo = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent expanding/collapsing when clicking the button
    setRemovingId(id);
    
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/session/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('Failed to delete session on DB:', err);
    }

    setTimeout(() => {
      setThoughts(prev => {
        const updated = prev.filter(t => t.id !== id);
        localStorage.setItem('thoughtsHistory', JSON.stringify(updated));
        return updated;
      });
      setRemovingId(null);
    }, 400); // Wait for CSS transition
  };

  const renderList = (items: any[], sectionKey: string, thoughtId: string) => {
    const normalized = normalizeItems(items);
    if (normalized.length === 0) return null;

    return (
      <ul className="space-y-3 mt-2">
        {normalized.map((item, idx) => {
          const key = `${thoughtId}-${sectionKey}-${idx}`;
          const isExpanded = expandedItem === key;

          return (
            <li 
              key={idx}
              onClick={(e) => {
                e.stopPropagation(); // prevent collapsing the main card
                setExpandedItem(isExpanded ? null : key);
              }}
              className="bg-black/20 hover:bg-black/30 border border-primary/5 rounded-2xl p-4 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between text-on-surface-variant group">
                <div className="flex items-start space-x-3 pr-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-2 shrink-0"></span>
                  <span className="text-[15px] font-light leading-relaxed text-white/95">{item.point}</span>
                </div>
                <div className="flex items-center space-x-1.5 shrink-0">
                  <span className="text-[11px] text-primary/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    {isExpanded ? 'Tutup' : 'Solusi'}
                  </span>
                  <ChevronDownIcon className={`w-4 h-4 text-primary transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* Collapsible Content */}
              <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0 pointer-events-none'}`}>
                <div className="overflow-hidden">
                  <div className="pt-2.5 text-[13px] font-light text-on-surface-variant border-t border-primary/10 leading-relaxed whitespace-pre-line">
                    {item.feedback}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <>
    <PageLayout innerClassName="pb-32">
      <div className="w-full h-full flex flex-col px-4 max-w-md mx-auto">
        <h1 className="text-3xl font-light tracking-wide mb-2 text-white">Your Nightly Thoughts</h1>
        <p className="text-primary/70 text-sm mb-8 font-light">A collection of your late-night reflections.</p>
      </div>

      <div className="w-full max-w-md mx-auto space-y-4">
        {thoughts.length === 0 ? (
          <div className="text-center py-16 space-y-6">
            <div className="w-20 h-20 rounded-full bg-white/5 mx-auto flex items-center justify-center ">
              <span className="text-3xl">🍃</span>
            </div>
            <p className="text-on-surface-variant font-light text-lg">Your mind is completely clear.</p>
          </div>
        ) : (
          <>
          {paginatedThoughts.map(thought => {
            const isExpanded = expandedId === thought.id;
            const isRemoving = removingId === thought.id;

            return (
              <div 
                key={thought.id}
                onClick={() => toggleExpand(thought.id)}
                className={`bg-[#1a231c]/40 border border-primary/10 rounded-3xl p-5 md:p-6 transition-all duration-400 ease-out cursor-pointer overflow-hidden
                  ${isExpanded ? 'bg-[#1a231c]/70 shadow-[0_10px_40px_rgba(0,0,0,0.4)] border-primary/20' : 'hover:bg-[#1e2a22]/60 hover:shadow-lg hover:-translate-y-0.5'}
                  ${isRemoving ? 'opacity-0 scale-90 translate-x-8' : 'opacity-100 scale-100 translate-x-0'}
                `}
              >
                {/* Header */}
                <div className={`flex justify-between items-center ${isExpanded ? 'mb-4' : ''}`}>
                  <div>
                    <div className="text-xs md:text-sm text-primary/80 font-medium tracking-wider uppercase">{thought.date}</div>
                  </div>
                  
                  {isExpanded ? (
                    <ChevronUpIcon className="w-5 h-5 text-on-surface-variant transition-transform" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 text-on-surface-variant transition-transform" />
                  )}
                </div>

                {/* Expanded Details */}
                <div 
                  className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-6' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden space-y-8">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                    
                    <div>
                      <h3 className="text-white text-base font-medium tracking-wide mb-3">What you shared</h3>
                      {renderList(thought.summary.today, "today", thought.id)}
                    </div>
                    
                    <div>
                      <h3 className="text-primary text-base font-medium tracking-wide mb-3">Focus for tomorrow</h3>
                      {renderList(thought.summary.tomorrow, "tomorrow", thought.id)}
                    </div>

                    <div>
                      <h3 className="text-on-surface-variant text-base font-medium tracking-wide mb-3">Letting go</h3>
                      {renderList(thought.summary.letGo, "letgo", thought.id)}
                    </div>

                    {/* Action */}
                    <div className="pt-2 flex justify-end">
                      <button 
                        onClick={(e) => handleLetGo(thought.id, e)}
                        className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#1e2a22] hover:bg-red-500/10 text-on-surface-variant hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all duration-300 text-sm font-medium group"
                      >
                        <TrashIcon className="w-4 h-4 group-hover:-rotate-12 transition-transform" />
                        <span>Let it go completely</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
          
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-4 pt-6 pb-16">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-full border border-primary/20 text-primary hover:bg-primary/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all text-sm font-medium"
              >
                Previous
              </button>
              <span className="text-on-surface-variant text-sm font-light">
                Page {currentPage} of {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-full border border-primary/20 text-primary hover:bg-primary/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all text-sm font-medium"
              >
                Next
              </button>
            </div>
          )}
          </>
        )}
      </div>

    </PageLayout>
    </>
  );
};

export default Thoughts;
