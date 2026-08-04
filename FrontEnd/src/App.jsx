import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import CustomerShop from './pages/CustomerShop'
import ProtectedRoute from './components/ProtectedRoute'
import Signup from './pages/Signup'
import CarDetail from './pages/CarDetail'
import AdminInquiries from './pages/AdminInquiries'
import AdminOrders from './pages/AdminOrder'
import MyOrders from './pages/MyOrders'

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
        path="/admin/inquiries"
        element={
        <ProtectedRoute allowedRole="ADMIN">
          <AdminInquiries />
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
        path="/admin/orders"
        element={
        <ProtectedRoute allowedRole="ADMIN">
          <AdminOrders />
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