import { useState, useEffect } from 'react'
import axiosInstance from '../api/axiosInstance'

function ManageRepairs({ car, onClose }) {
  const [repairs, setRepairs] = useState([])
  const [description, setDescription] = useState('')
  const [cost, setCost] = useState('')
  const [repairDate, setRepairDate] = useState('')
  const [performedBy, setPerformedBy] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchRepairs()
  }, [])

  const fetchRepairs = async () => {
    try {
      const response = await axiosInstance.get(`/api/admin/cars/${car.id}/repairs`)
      setRepairs(response.data)
    } catch (err) {
      setError('Failed to load repairs')
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await axiosInstance.post(`/api/admin/cars/${car.id}/repairs`, {
        description,
        cost: parseFloat(cost),
        repairDate,
        performedBy,
      })
      setDescription('')
      setCost('')
      setRepairDate('')
      setPerformedBy('')
      fetchRepairs()
    } catch (err) {
      setError('Failed to add repair record')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (repairId) => {
    try {
      await axiosInstance.delete(`/api/admin/cars/${car.id}/repairs/${repairId}`)
      fetchRepairs()
    } catch (err) {
      setError('Failed to delete repair record')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          Repair History — {car.make} {car.model}
        </h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <div className="flex flex-col gap-2 mb-4">
          {repairs.length === 0 ? (
            <p className="text-gray-400 text-sm">No repairs logged yet.</p>
          ) : (
            repairs.map((r) => (
              <div key={r.id} className="border rounded p-2 text-sm relative">
                <p className="font-semibold">{r.description}</p>
                <p className="text-gray-500">
                  ₹{r.cost} • {r.repairDate} • {r.performedBy}
                </p>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="absolute top-2 right-2 text-red-500 text-xs"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleAdd} className="flex flex-col gap-3 border-t pt-4">
          <input
            placeholder="Description (e.g. Fixed bumper)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="number"
            placeholder="Cost"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="date"
            value={repairDate}
            onChange={(e) => setRepairDate(e.target.value)}
            className="border rounded px-3 py-2"
            required
          />
          <input
            placeholder="Performed by (e.g. workshop name)"
            value={performedBy}
            onChange={(e) => setPerformedBy(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-purple-600 text-white py-2 rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {submitting ? 'Adding...' : 'Add Repair'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ManageRepairs