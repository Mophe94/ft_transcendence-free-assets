import { Outlet } from 'react-router-dom';
import { NavBar } from '../components/nav-bar/NavBar';
import './AppLayout.css';

export default function AppLayout() {
  return (
    <>
      <NavBar />
      <div className="body-layout">
        <div className="side-padding-left"></div>
        <div className="public-content">
          <Outlet />
        </div>
        <div className="side-padding-right"></div>
      </div>
    </>
  );
}
