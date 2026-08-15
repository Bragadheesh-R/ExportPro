import { useState, useEffect } from 'react'
import axiosInstance from '../api/axiosInstance'
import CarCard from '../components/CarCard'
import CustomerNavbar from '../components/CustomerNavbar'

function CustomerShop() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  return (
    <div className="min-h-screen bg-gray-100">
      <CustomerNavbar />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">ExportPro Shop</h1>

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
    </div>
  )
}

export default CustomerShop