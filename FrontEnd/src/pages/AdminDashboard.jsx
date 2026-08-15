import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
import AddCarForm from './AddCarForm'
import AdminNavbar from '../components/AdminNavbar'
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from 'recharts'

const STATUS_COLORS = {
  RESERVED: '#eab308',
  COMPLETED: '#22c55e',
  CANCELLED: '#ef4444',
}

function AdminDashboard() {
  const [cars, setCars] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCars()
    fetchAnalytics()
  }, [])

  const fetchCars = async () => {
    try {
      const response = await axiosInstance.get('/api/admin/cars')
      setCars(response.data)
    } catch (err) {
      setError('Failed to load cars')
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await axiosInstance.get('/api/admin/analytics')
      setAnalytics(response.data)
    } catch (err) {
      setError('Failed to load analytics')
    }
  }

  const previewCars = cars.slice(0, 8)
  const pieData = analytics
    ? Object.entries(analytics.ordersByStatus).map(([status, count]) => ({ name: status, value: count }))
    : []

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />

      <div className="p-6">
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Analytics summary */}
        {analytics && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-purple-600">₹{analytics.totalRevenue}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-2xl font-bold">{analytics.totalOrders}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-gray-500 text-sm">Total Cars Listed</p>
                <p className="text-2xl font-bold">{analytics.totalCars}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="font-semibold mb-4">Orders by Status</h2>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="font-semibold mb-4">Sales Over Time</h2>
                {analytics.salesOverTime.length === 0 ? (
                  <p className="text-gray-400 text-sm">No completed sales yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={analytics.salesOverTime}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="amount" fill="#9333ea" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </>
        )}

        {/* Car preview */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Cars</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              + Add Car
            </button>
            <button
              onClick={() => navigate('/admin/cars')}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              View All Cars
            </button>
          </div>
        </div>

        {loading ? (
          <p>Loading cars...</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3">Make</th>
                  <th className="p-3">Model</th>
                  <th className="p-3">Year</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {previewCars.map((car) => (
                  <tr key={car.id} className="border-t">
                    <td className="p-3">{car.make}</td>
                    <td className="p-3">{car.model}</td>
                    <td className="p-3">{car.year}</td>
                    <td className="p-3">₹{car.price}</td>
                    <td className="p-3">{car.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {cars.length > 8 && (
          <p className="text-sm text-gray-500 mt-2">
            Showing 8 of {cars.length} cars —{' '}
            <button onClick={() => navigate('/admin/cars')} className="text-purple-600 hover:underline">
              view all
            </button>
          </p>
        )}
      </div>

      {showAddForm && (
        <AddCarForm onClose={() => setShowAddForm(false)} onCarAdded={fetchCars} />
      )}
    </div>
  )
}

export default AdminDashboard