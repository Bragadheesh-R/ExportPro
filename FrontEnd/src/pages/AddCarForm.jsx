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
      setError('Failed to load ports')
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await axiosInstance.post('/api/admin/cars', {
        ...form,
        year: parseInt(form.year),
        price: parseFloat(form.price),
        mileage: parseInt(form.mileage),
        portId: parseInt(form.portId),
      })
      onCarAdded()
      onClose()
    } catch (err) {
      setError('Failed to add car. Check all fields are valid.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Add New Car</h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

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
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />
          <input
            name="mileage"
            type="number"
            placeholder="Mileage"
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