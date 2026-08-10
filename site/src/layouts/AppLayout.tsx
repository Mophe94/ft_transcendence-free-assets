import { Outlet } from 'react-router-dom';
import { NavBar } from '../components/nav-bar/NavBar';

export default function AppLayout() {
  return (
    <>
      <NavBar />
      <div className="w-[min(95vw,1500px)] mt-8 mx-auto flex flex-col">
        <Outlet />
      </div>
    </>
  );
}