import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
import AddCarForm from './AddCarForm'
import ManageImages from './ManageImages'

function AdminDashboard() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const navigate = useNavigate()
  const [manageImagesCar, setManageImagesCar] = useState(null)

  const username = sessionStorage.getItem('username')

  useEffect(() => {
    fetchCars()
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

  const handleMarkSold = async (id) => {
    try {
      await axiosInstance.put(`/api/admin/cars/${id}/mark-sold`)
      fetchCars()
    } catch (err) {
      setError('Failed to update car status')
    }
  }

  const handleMarkAvailable = async (id) => {
    try {
      await axiosInstance.put(`/api/admin/cars/${id}/mark-available`)
      fetchCars()
    } catch (err) {
      setError('Failed to update car status')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this car permanently?')) return
    try {
      await axiosInstance.delete(`/api/admin/cars/${id}`)
      fetchCars()
    } catch (err) {
      setError('Failed to delete car')
    }
  }

  const handleLogout = () => {
    sessionStorage.clear()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Welcome, {username}</span>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            + Add Car
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
          <button
            onClick={() => navigate('/admin/inquiries')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            View Inquiries
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

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
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id} className="border-t">
                  <td className="p-3">{car.make}</td>
                  <td className="p-3">{car.model}</td>
                  <td className="p-3">{car.year}</td>
                  <td className="p-3">₹{car.price}</td>
                  <td className="p-3">{car.status}</td>
                  <td className="p-3 flex gap-2">
                    {car.status === 'AVAILABLE' ? (
                      <button
                        onClick={() => handleMarkSold(car.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                      >
                        Mark Sold
                      </button>
                    ) : (
                      <button
                        onClick={() => handleMarkAvailable(car.id)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                      >
                        Mark Available
                      </button>
                    )}
                    <button
                      onClick={() => setManageImagesCar(car)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      Images
                    </button>
                    <button
                      onClick={() => handleDelete(car.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddForm && (
        <AddCarForm
          onClose={() => setShowAddForm(false)}
          onCarAdded={fetchCars}
        />
      )}
      {manageImagesCar && (
        <ManageImages
          car={manageImagesCar}
          onClose={() => setManageImagesCar(null)}
        />
      )}
    </div>
  )
}

export default AdminDashboard