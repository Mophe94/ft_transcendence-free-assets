import { Outlet } from 'react-router-dom';
import { NavBar } from '../components/nav-bar/NavBar';
import './AppLayout.css';

export default function AppLayout() {
  return (
    <>
      <NavBar />
      <div className="body-layout">
          <Outlet />
      </div>
    </>
  );
}
