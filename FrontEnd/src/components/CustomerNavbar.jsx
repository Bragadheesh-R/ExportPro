import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

function CustomerNavbar() {
  const navigate = useNavigate()
  const username = sessionStorage.getItem('username')
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    sessionStorage.clear()
    navigate('/')
  }

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded text-sm font-medium ${
      isActive ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-200'
    }`

  const mobileLinkClass = ({ isActive }) =>
    `block px-3 py-2 rounded text-sm font-medium ${
      isActive ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-200'
    }`

  return (
    <nav className="bg-white shadow sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        <div className="flex items-center gap-2">
          <img src="/logo.gif" alt="ExportPro" className="w-9 h-9 sm:w-10 sm:h-10" />
          <span className="font-bold text-base sm:text-lg">ExportPro</span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/shop" className={linkClass}>Shop</NavLink>
          <NavLink to="/my-orders" className={linkClass}>My Orders</NavLink>
          <NavLink to="/my-inquiries" className={linkClass}>My Inquiries</NavLink>
        </div>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-3">
          <span className="text-gray-500 text-sm">Welcome, {username}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Mobile hamburger button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-gray-600"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown panel */}
      {menuOpen && (
        <div className="md:hidden border-t px-4 py-3 flex flex-col gap-1">
          <NavLink to="/shop" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>
            Shop
          </NavLink>
          <NavLink to="/my-orders" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>
            My Orders
          </NavLink>
          <NavLink to="/my-inquiries" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>
            My Inquiries
          </NavLink>
          <div className="border-t mt-2 pt-3 flex items-center justify-between">
            <span className="text-gray-500 text-sm">Welcome, {username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default CustomerNavbar