import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AdminDashboard from './pages/AdminDashboard'
import AdminCars from './pages/AdminCars'
import AdminOrders from './pages/AdminOrders'
import AdminInquiries from './pages/AdminInquiries'
import CustomerShop from './pages/CustomerShop'
import CarDetail from './pages/CarDetail'
import MyOrders from './pages/MyOrders'
import MyInquiries from './pages/MyInquiries'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes - anyone can access, no login required */}
        <Route path="/" element={<CustomerShop />} />
        <Route path="/car/:id" element={<CarDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin routes - protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/cars"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminCars />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/inquiries"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminInquiries />
            </ProtectedRoute>
          }
        />

        {/* Customer routes - protected (require actual login) */}
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute allowedRole="CUSTOMER">
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-inquiries"
          element={
            <ProtectedRoute allowedRole="CUSTOMER">
              <MyInquiries />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App