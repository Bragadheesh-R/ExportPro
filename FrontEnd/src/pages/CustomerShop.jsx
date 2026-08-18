import { useState, useEffect, useMemo } from 'react'
import axiosInstance from '../api/axiosInstance'
import CarCard from '../components/CarCard'
import CustomerNavbar from '../components/CustomerNavbar'

function CustomerShop() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [makeFilter, setMakeFilter] = useState('ALL')
  const [modelFilter, setModelFilter] = useState('ALL')
  const [yearFilter, setYearFilter] = useState('ALL')

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

  const makes = useMemo(
    () => [...new Set(cars.map((c) => c.make))].sort(),
    [cars]
  )
  const models = useMemo(
    () =>
      [...new Set(
        cars
          .filter((c) => makeFilter === 'ALL' || c.make === makeFilter)
          .map((c) => c.model)
      )].sort(),
    [cars, makeFilter]
  )
  const years = useMemo(
    () => [...new Set(cars.map((c) => c.year))].sort((a, b) => b - a),
    [cars]
  )

  const filteredCars = cars.filter((car) => {
    const matchesMake = makeFilter === 'ALL' || car.make === makeFilter
    const matchesModel = modelFilter === 'ALL' || car.model === modelFilter
    const matchesYear = yearFilter === 'ALL' || car.year === Number(yearFilter)
    return matchesMake && matchesModel && matchesYear
  })

  const resetFilters = () => {
    setMakeFilter('ALL')
    setModelFilter('ALL')
    setYearFilter('ALL')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <CustomerNavbar />

      <div className="p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">ExportPro Shop</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-4 flex flex-wrap gap-2 items-center">
          <select
            value={makeFilter}
            onChange={(e) => {
              setMakeFilter(e.target.value)
              setModelFilter('ALL')
            }}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="ALL">All Makes</option>
            {makes.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <select
            value={modelFilter}
            onChange={(e) => setModelFilter(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="ALL">All Models</option>
            {models.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="ALL">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          {(makeFilter !== 'ALL' || modelFilter !== 'ALL' || yearFilter !== 'ALL') && (
            <button
              onClick={resetFilters}
              className="text-purple-600 text-sm hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        <p className="text-sm text-gray-500 mb-3">
          Showing {filteredCars.length} of {cars.length} cars
        </p>

        {loading ? (
          <p>Loading cars...</p>
        ) : filteredCars.length === 0 ? (
          <p className="text-gray-500">No cars match your filters.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerShop