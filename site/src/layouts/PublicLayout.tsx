import { Outlet } from 'react-router-dom';
import { PubNavBar } from '../components/nav-bar/PubNavBar';
import './PublicLayout.css';


export default function PublicLayout() {
  return (
    <>
      <PubNavBar />
      <div className="body-layout">
        <div className="side-padding-left" />
        <div className="public-content">
          <Outlet />
        </div>
        <div className="side-padding-right" />
      </div>
    </>
  );
}
