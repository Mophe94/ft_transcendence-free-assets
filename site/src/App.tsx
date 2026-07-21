import './App.css';

import { Route, Routes } from 'react-router-dom';
import { Landing } from './page/Welcome';
import { Home } from './page/Home';
import { ProtectedRoute } from './components/ProtectedRoute';
import AuthCallback from './page/Auth';
import PublicLayout from './layouts/PublicLayout';
import AppLayout from './layouts/AppLayout';
import { Play } from './page/Play';
import Profile from './page/Profile';
import Contact from './page/Contact';
import Dashboard from './page/Dashboard';
import { useAuth } from './context/AuthContext';
import { Loading } from './page/Loading';
import { Test } from './page/Test';

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <Loading />
    );
  }

  return (
    <div className="main-layout">
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/contact" element={<Contact />} />
          <Route path='/loading' element={<Loading />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/play" element={<Play />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path='/test' element={<Test />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
