import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import Session from './pages/Session';
import Summary from './pages/Summary';
import ClosureSummary from './pages/ClosureSummary';
import Thoughts from './pages/Thoughts';
import Profile from './pages/Profile';
import Mood from './pages/Mood';
import Reminder from './pages/Reminder';
import EndSession from './pages/EndSession';
import ReminderPopup from './components/ReminderPopup';
import BottomNav from './components/BottomNav';

const NavigationWrapper = () => {
  const location = useLocation();
  const showNav = ['/', '/thoughts', '/profile'].includes(location.pathname);
  return showNav ? <BottomNav /> : null;
};

function App() {
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    const checkReminder = () => {
      if (showReminder) return;

      const bedtime = localStorage.getItem('bedtimeReminder');
      if (!bedtime) return;

      const lastShownTime = localStorage.getItem('reminderLastShownTime');
      const today = new Date().toDateString();
      const lastShownDate = localStorage.getItem('reminderLastShownDate');

      // If already shown for this specific bedtime TODAY, don't show again.
      // But if they change the bedtime, or it's a new day, allow it to show.
      if (lastShownDate === today && lastShownTime === bedtime) return;

      const [bedHour, bedMin] = bedtime.split(':').map(Number);
      
      const now = new Date();
      const currentHour = now.getHours();
      const currentMin = now.getMinutes();

      const bedTotalMins = bedHour * 60 + bedMin;
      let nowTotalMins = currentHour * 60 + currentMin;

      // Handle crossing midnight
      let diff = nowTotalMins - bedTotalMins;
      if (diff < -720) diff += 1440;
      if (diff > 720) diff -= 1440;

      // Trigger window: between 3 mins before bedtime and 2 hours after
      if (diff >= -3 && diff <= 120) {
        setShowReminder(true);
      }
    };

    checkReminder(); // Check on mount
    const interval = setInterval(checkReminder, 10000); // Check every 10s for faster testing response
    return () => clearInterval(interval);
  }, [showReminder]);

  const handleDismissReminder = () => {
    setShowReminder(false);
    const bedtime = localStorage.getItem('bedtimeReminder');
    if (bedtime) {
      localStorage.setItem('reminderLastShownTime', bedtime);
      localStorage.setItem('reminderLastShownDate', new Date().toDateString());
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/session" element={<Session />} />
        <Route path="/closure" element={<ClosureSummary />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/thoughts" element={<Thoughts />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/mood" element={<Mood />} />
        <Route path="/reminder" element={<Reminder />} />
        <Route path="/end-session" element={<EndSession />} />
      </Routes>
      <NavigationWrapper />
      {showReminder && <ReminderPopup onDismiss={handleDismissReminder} />}
    </Router>
  );
}

export default App;
