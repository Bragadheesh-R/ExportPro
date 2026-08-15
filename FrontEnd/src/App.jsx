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
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

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

        <Route
          path="/shop"
          element={
            <ProtectedRoute allowedRole="CUSTOMER">
              <CustomerShop />
            </ProtectedRoute>
          }
        />
        <Route
          path="/car/:id"
          element={
            <ProtectedRoute allowedRole="CUSTOMER">
              <CarDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute allowedRole="CUSTOMER">
              <MyOrders />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App