import { Route, Routes } from 'react-router-dom';
import Landing from './page/Welcome';
import Home from './page/Home';
import { ProtectedRoute } from './components/ProtectedRoute';
import AuthCallback from './page/Auth';
import AppLayout from './layouts/AppLayout';
import Play from './page/Play';
import Profile from './page/Profile';
import Dashboard from './page/Dashboard';
import { useAuth } from './context/AuthContext';
import { Loading } from './content/Loading';
import Test from './page/Test';
import AboutUs from './page/AboutUs';
import ErrorDisplay from './content/Error';
import Readme from './page/Readme';
import HowToPlay from './page/HowTo';

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <Loading />
    );
  }

  return (
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/play" element={<Play />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/howto" element={<HowToPlay/>} />
          </Route>
        </Route>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path='/loading' element={<Loading />} />
          <Route path='/readme' element={<Readme />} />
          <Route path='/aboutus' element={<AboutUs />} />
          <Route path='/test' element={<Test />} />
        </Route>
        <Route element={<AppLayout />}>
          <Route path="*" element={<ErrorDisplay msg="Page not found" code={404} />} />
        </Route>
      </Routes>
  );
}

export default App;
