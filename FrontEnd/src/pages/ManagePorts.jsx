import { useState, useEffect } from 'react'
import axiosInstance from '../api/axiosInstance'

function ManagePorts({ onClose }) {
  const [ports, setPorts] = useState([])
  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [region, setRegion] = useState('')
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

  const handleAdd = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await axiosInstance.post('/api/admin/ports', { name, country, region })
      setName('')
      setCountry('')
      setRegion('')
      fetchPorts()
    } catch (err) {
      setError('Failed to add port')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this port?')) return
    setError('')
    try {
      await axiosInstance.delete(`/api/admin/ports/${id}`)
      fetchPorts()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete port')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Manage Shipping Ports</h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <div className="flex flex-col gap-2 mb-4">
          {ports.length === 0 ? (
            <p className="text-gray-400 text-sm">No ports yet.</p>
          ) : (
            ports.map((port) => (
              <div key={port.id} className="border rounded p-2 text-sm flex justify-between items-center">
                <div>
                  <p className="font-semibold">{port.name}</p>
                  <p className="text-gray-500">{port.country}{port.region ? ` — ${port.region}` : ''}</p>
                </div>
                <button
                  onClick={() => handleDelete(port.id)}
                  className="text-red-500 text-xs px-2 py-1 hover:bg-red-50 rounded"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleAdd} className="flex flex-col gap-2 border-t pt-4">
          <p className="text-sm font-semibold">Add New Port</p>
          <input
            placeholder="Port name (e.g. Mumbai Port)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-3 py-2"
            required
          />
          <input
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="border rounded px-3 py-2"
            required
          />
          <input
            placeholder="Region (optional)"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-purple-600 text-white py-2 rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {submitting ? 'Adding...' : 'Add Port'}
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

export default ManagePorts