import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import MobileNav from './MobileNav'

function Layout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pb-16 md:pb-0">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  )
}

export default Layout
