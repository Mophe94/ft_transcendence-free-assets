import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Landing } from './page/Welcome';
import { Home } from './page/Home';
import { ProtectedRoute } from './components/ProtectedRoute';
import AuthCallback from './page/Auth';
import PublicLayout from './layouts/PublicLayout';
import AppLayout from './layouts/AppLayout';
import { Play } from './page/Play';
import Profile from './page/Profile';
import Settings from './page/Settings';
import Preferences from './page/Preferences';
import Contact from './page/Contact';
import Dashboard from './page/Dashboard';

function App() {
  return (
    <div className="main-layout">
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/play" element={<Play />} />
            <Route path="/preferences" element={<Preferences />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
