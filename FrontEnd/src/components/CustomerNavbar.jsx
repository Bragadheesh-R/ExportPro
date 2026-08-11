import { NavLink, useNavigate } from 'react-router-dom'

function CustomerNavbar() {
  const navigate = useNavigate()
  const username = sessionStorage.getItem('username')

  const handleLogout = () => {
    sessionStorage.clear()
    navigate('/')
  }

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded text-sm font-medium ${
      isActive ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-200'
    }`

  return (
    <nav className="bg-white shadow sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img src="/exportpro-logo.gif" alt="ExportPro" className="w-10 h-10" />
            <span className="font-bold text-lg">ExportPro</span>
          </div>
          <NavLink to="/shop" className={linkClass}>Shop</NavLink>
          <NavLink to="/my-orders" className={linkClass}>My Orders</NavLink>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-500 text-sm hidden sm:inline">Welcome, {username}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default CustomerNavbar