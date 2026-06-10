import "./App.css"
import {NavBar} from "./components/NavBar"
import {Footer} from "./components/Footer"
import { Routes, Route } from 'react-router-dom';
 import AuthCallback from './pages/Auth';
import Home from './pages/Home';
import Test from "./pages/Test";
import Play from './pages/Play';
import {ProtectedRoute} from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import { Preferences } from "./pages/Preferences";


function App() {
  return (
    <div className="app-layout">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={
          <ProtectedRoute>
            <Play />
            </ProtectedRoute>} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/profile/:username?" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/preferences" element={
          <ProtectedRoute>
            <Preferences />
          </ProtectedRoute>
        } />
          <Route path="/test" element={<Test />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App
