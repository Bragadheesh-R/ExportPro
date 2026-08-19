import { useState, useEffect } from 'react'
import axiosInstance from '../api/axiosInstance'

function AddCarForm({ onClose, onCarAdded }) {
  const [ports, setPorts] = useState([])
  const [form, setForm] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    condition: '',
    vin: '',
    portId: '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchPorts()
  }, [])

  const fetchPorts = async () => {
    try {
      const response = await axiosInstance.get('/api/admin/ports')
      setPorts(response.data)
    } catch (err) {
      console.error('Failed to load ports:', err)
      setError('Failed to load ports')
    }
  }

  // Format numbers using Indian numbering system.
  // Example:
  // 9250000 -> 92,50,000
  // 38500   -> 38,500
  const formatIndianNumber = (value) => {
    if (value === '' || value === null || value === undefined) {
      return ''
    }

    // Remove anything that is not a digit
    const digits = String(value).replace(/\D/g, '')

    if (!digits) {
      return ''
    }

    return Number(digits).toLocaleString('en-IN')
  }

  // Remove commas before sending the value to backend.
  // Example:
  // 92,50,000 -> 9250000
  // 38,500   -> 38500
  const getNumericValue = (value) => {
    if (!value) {
      return ''
    }

    return String(value).replace(/,/g, '')
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    // Price formatting
    if (name === 'price') {
      setForm({
        ...form,
        price: formatIndianNumber(value),
      })
      return
    }

    // Mileage formatting
    if (name === 'mileage') {
      setForm({
        ...form,
        mileage: formatIndianNumber(value),
      })
      return
    }

    setForm({
      ...form,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const price = getNumericValue(form.price)
      const mileage = getNumericValue(form.mileage)

      const year = parseInt(form.year, 10)
      const priceNumber = parseFloat(price)
      const mileageNumber = mileage ? parseInt(mileage, 10) : null
      const portId = parseInt(form.portId, 10)

      // Basic validation
      if (!Number.isInteger(year)) {
        setError('Please enter a valid year.')
        setSubmitting(false)
        return
      }

      if (!Number.isFinite(priceNumber)) {
        setError('Please enter a valid price.')
        setSubmitting(false)
        return
      }

      if (mileage && !Number.isInteger(mileageNumber)) {
        setError('Please enter a valid mileage.')
        setSubmitting(false)
        return
      }

      if (!Number.isInteger(portId)) {
        setError('Please select a shipping port.')
        setSubmitting(false)
        return
      }

      const carData = {
        ...form,

        // Send plain numeric values to Spring Boot
        year: year,
        price: priceNumber,
        mileage: mileageNumber,
        portId: portId,
      }

      console.log('Adding car:', carData)

      await axiosInstance.post('/api/admin/cars', carData)

      onCarAdded()
      onClose()
    } catch (err) {
      console.error('Failed to add car:', err)

      // Show actual backend error when available
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        `Failed to add car (${err.response?.status || 'network error'})`
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Add New Car</h2>

        {error && (
          <p className="text-red-500 text-sm mb-3">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            name="make"
            placeholder="Make (e.g. Toyota)"
            value={form.make}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />

          <input
            name="model"
            placeholder="Model (e.g. Camry)"
            value={form.model}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />

          <input
            name="year"
            type="number"
            placeholder="Year"
            value={form.year}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />

          {/* Price */}
          <input
            name="price"
            type="text"
            inputMode="numeric"
            placeholder="Price (e.g. 92,50,000)"
            value={form.price}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />

          {/* Mileage */}
          <input
            name="mileage"
            type="text"
            inputMode="numeric"
            placeholder="Mileage (e.g. 38,500)"
            value={form.mileage}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />

          <input
            name="condition"
            placeholder="Condition (e.g. Good)"
            value={form.condition}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />

          <input
            name="vin"
            placeholder="VIN"
            value={form.vin}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />

          <select
            name="portId"
            value={form.portId}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          >
            <option value="">Select Shipping Port</option>

            {ports.map((port) => (
              <option key={port.id} value={port.id}>
                {port.name}, {port.country}
              </option>
            ))}
          </select>

          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-purple-600 text-white py-2 rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {submitting ? 'Adding...' : 'Add Car'}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddCarForm