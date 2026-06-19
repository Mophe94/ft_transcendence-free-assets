import { Outlet } from "react-router-dom";
import { PrivNavBar } from "../components/nav-bar/PrivNavBar";
import './PublicLayout.css'

export default function AppLayout() {
  return (
    <>
        <PrivNavBar />
        <div className='body-layout'>
        <div className='side-padding-left'></div>
        <div className="public-content">
            <Outlet />
        </div>
        <div className='side-padding-right'></div>
        </div>
    </>
  )
}