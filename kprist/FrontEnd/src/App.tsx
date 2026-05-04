import "./App.css"
import NavBar from "./components/NavBar"
import Footer from "./components/Footer"
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Play from './pages/Play';


function App() {
  return (
    <div className="app-layout">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<Play />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App
