import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'

function CustomerShop() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const username = sessionStorage.getItem('username')

  useEffect(() => {
    fetchCars()
  }, [])

  const fetchCars = async () => {
    try {
      const response = await axiosInstance.get('/api/public/cars')
      setCars(response.data)
    } catch (err) {
      setError('Failed to load cars')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.clear()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ExportPro Shop</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Welcome, {username}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading ? (
        <p>Loading cars...</p>
      ) : cars.length === 0 ? (
        <p className="text-gray-500">No cars available right now.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cars.map((car) => (
            <div key={car.id} className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-bold">
                {car.make} {car.model}
              </h2>
              <p className="text-gray-600">{car.year} • {car.mileage} km</p>
              <p className="text-gray-600">Condition: {car.condition}</p>
              <p className="text-purple-600 font-bold text-xl mt-2">
                ₹{car.price}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Ships from {car.shippingPort?.name}, {car.shippingPort?.country}
              </p>
              <button
              onClick={() => navigate(`/car/${car.id}`)}
              className="mt-3 w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
                View Details
                </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CustomerShop