import { Outlet } from 'react-router-dom';
import { NavBar } from '../components/nav-bar/NavBar';
import './AppLayout.css';
import Footer from '../components/Footer';

export default function AppLayout() {
  return (
    <>
      <NavBar />
      <div className="body-layout">
          <Outlet />
      </div>
	  <Footer />
    </>
  );
}
