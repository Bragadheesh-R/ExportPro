import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from 'recharts'

const STATUS_COLORS = {
  RESERVED: '#eab308',
  COMPLETED: '#22c55e',
  CANCELLED: '#ef4444',
}

function AdminAnalytics() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await axiosInstance.get('/api/admin/analytics')
      setData(response.data)
    } catch (err) {
      setError('Failed to load analytics')
    }
  }

  if (error) {
    return <p className="text-red-500 p-6">{error}</p>
  }

  if (!data) {
    return <p className="p-6">Loading analytics...</p>
  }

  const pieData = Object.entries(data.ordersByStatus).map(([status, count]) => ({
    name: status,
    value: count,
  }))

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <button
          onClick={() => navigate('/admin')}
          className="text-purple-600 hover:underline"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <p className="text-2xl font-bold text-purple-600">₹{data.totalRevenue}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <p className="text-2xl font-bold">{data.totalOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500 text-sm">Total Cars Listed</p>
          <p className="text-2xl font-bold">{data.totalCars}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-4">Orders by Status</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
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
          {data.salesOverTime.length === 0 ? (
            <p className="text-gray-400 text-sm">No completed sales yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.salesOverTime}>
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
    </div>
  )
}

export default AdminAnalytics