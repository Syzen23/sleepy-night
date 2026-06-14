import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';

import PageLayout from '../components/PageLayout';

type SummaryItem = {
  point: string;
  feedback: string;
};

const normalizeItems = (items: any[]): SummaryItem[] => {
  if (!Array.isArray(items)) return [];
  return items.map(item => {
    if (typeof item === 'string') {
      return { point: item, feedback: 'I am here to support you.' };
    }
    if (item && typeof item === 'object') {
      return {
        point: item.point || item.pikiran || item.text || item.content || item.summary || '',
        feedback: item.feedback || item.solusi || item.penjelasan || 'I am here to support you.'
      };
    }
    return { point: String(item), feedback: 'I am here to support you.' };
  });
};

const Summary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const summary = location.state?.summary || {
    summaryShared: ["Completed UI project", "Meeting with team"],
    summaryTomorrow: ["Prepare presentation", "Find design inspiration"],
    summaryLetGo: ["Overthinking results", "Things out of my control"]
  };

  const todayList = summary.summaryShared || [];
  const tomorrowList = summary.summaryTomorrow || [];
  const letGoList = summary.summaryLetGo || [];

  const renderSection = (title: string, items: any[], sectionKey: string) => {
    const normalized = normalizeItems(items);
    if (normalized.length === 0) return null;

    return (
      <div className="w-full space-y-4">
        <h2 className="text-xl font-medium text-white tracking-wide">{title}</h2>
        <ul className="space-y-3">
          {normalized.map((item, idx) => {
            const key = `${sectionKey}-${idx}`;
            const isExpanded = expandedItem === key;

            return (
              <li 
                key={idx} 
                onClick={() => setExpandedItem(isExpanded ? null : key)}
                className="bg-[#1a231c]/30 hover:bg-[#1a231c]/50 border border-primary/5 rounded-2xl p-4 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between text-on-surface-variant group">
                  <div className="flex items-center space-x-3 pr-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0"></span>
                    <span className="text-base font-light text-white/95">{item.point}</span>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-xs text-primary/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      {isExpanded ? 'Close' : 'View Feedback'}
                    </span>
                    <ChevronDownIcon className={`w-4 h-4 text-primary transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {/* Collapsible Content */}
                <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0 pointer-events-none'}`}>
                  <div className="overflow-hidden">
                    <div className="pt-2 text-sm font-light text-on-surface-variant border-t border-primary/10 leading-relaxed whitespace-pre-line">
                      {item.feedback}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <PageLayout innerClassName="pb-32 w-full">
      <div className="w-full max-w-md mx-auto space-y-8 md:space-y-12">
        {renderSection("Today", todayList, "today")}
        {renderSection("Tomorrow", tomorrowList, "tomorrow")}
        {renderSection("Let Go", letGoList, "letgo")}
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-8 flex justify-center bg-gradient-to-t from-background via-background/90 to-transparent z-20">
        <button
          onClick={() => navigate('/end-session')}
          className="w-full max-w-xs flex items-center justify-center space-x-2 px-8 py-4 rounded-full bg-[#1e2a22] hover:bg-[#25362a] border border-primary/20 text-white font-medium transition-all shadow-lg hover:shadow-primary/10"
        >
          <span>Feels good</span>
          <SparklesIcon className="w-5 h-5 text-primary" />
        </button>
      </div>
    </PageLayout>
  );
};

export default Summary;
