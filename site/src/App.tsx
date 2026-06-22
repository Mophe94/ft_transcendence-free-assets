import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Landing } from './page/Welcome'
import { Home } from './page/Home'
import { ProtectedRoute } from "./components/ProtectedRoute"
import AuthCallback from './page/Auth'
import PublicLayout from './layouts/PublicLayout'
import AppLayout from './layouts/AppLayout'
import { Play } from './page/Play'
import Profile from './page/Profile'
import Settings from './page/Settings'

function App() {
  return (
    <div className='main-layout'>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path='/' element={<Landing />}/>
            <Route path="/auth/callback" element={<AuthCallback />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path='/home' element={<Home />} />
              <Route path='/play' element={<Play />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/settings' element={<Settings />} />
            </Route>
          </Route>
        </Routes>
    </div>
  )
}

export default App
