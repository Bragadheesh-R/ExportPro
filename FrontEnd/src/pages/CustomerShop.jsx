import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
import CarCard from '../components/CarCard'

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
            onClick={() => navigate('/my-orders')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            My Orders
          </button>
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
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  )
}

export default CustomerShop