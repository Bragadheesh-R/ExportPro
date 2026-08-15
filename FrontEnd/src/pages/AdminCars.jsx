import { useState, useEffect } from 'react'
import axiosInstance from '../api/axiosInstance'
import AdminNavbar from '../components/AdminNavbar'
import AddCarForm from './AddCarForm'
import ManageImages from './ManageImages'
import ManageRepairs from './ManageRepairs'
import EditCarForm from './EditCarForm'

function AdminCars() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [manageImagesCar, setManageImagesCar] = useState(null)
  const [manageRepairsCar, setManageRepairsCar] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [editingCar, setEditingCar] = useState(null)

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

  const handleMarkAvailable = async (id, carLabel) => {
    const confirmed = window.confirm(
      `Warning: "${carLabel}" may already have a completed order tied to it.\n\n` +
      `Marking it Available again allows it to be sold a second time, which can create ` +
      `conflicting orders for the same physical car.\n\n` +
      `Check the Orders page first if you're unsure. Continue anyway?`
    )
    if (!confirmed) return

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

  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      search.trim() === '' ||
      car.make.toLowerCase().includes(search.toLowerCase()) ||
      car.model.toLowerCase().includes(search.toLowerCase()) ||
      (car.vin && car.vin.toLowerCase().includes(search.toLowerCase()))

    const matchesStatus = statusFilter === 'ALL' || car.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">All Cars</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            + Add Car
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="Search by make, model, or VIN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-2 flex-1"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="RESERVED">Reserved</option>
            <option value="SOLD">Sold</option>
          </select>
        </div>

        <p className="text-sm text-gray-500 mb-2">
          Showing {filteredCars.length} of {cars.length} cars
        </p>

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
                {filteredCars.map((car) => (
                  <tr key={car.id} className="border-t">
                    <td className="p-3">{car.make}</td>
                    <td className="p-3">{car.model}</td>
                    <td className="p-3">{car.year}</td>
                    <td className="p-3">₹{car.price}</td>
                    <td className="p-3">{car.status}</td>
                    <td className="p-3 flex gap-2 flex-wrap">
                      {car.status === 'AVAILABLE' ? (
                        <button
                          onClick={() => handleMarkSold(car.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                        >
                          Mark Sold
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMarkAvailable(car.id, `${car.make} ${car.model}`)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                        >
                          Mark Available
                        </button>
                      )}
                      <button
  onClick={() => setEditingCar(car)}
  className="bg-indigo-500 text-white px-3 py-1 rounded text-sm hover:bg-indigo-600"
>
  Edit
</button>
                      <button
                        onClick={() => setManageImagesCar(car)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                      >
                        Images
                      </button>
                      <button
                        onClick={() => setManageRepairsCar(car)}
                        className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600"
                      >
                        Repairs
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
                {filteredCars.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-gray-400">
                      No cars match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAddForm && (
        <AddCarForm onClose={() => setShowAddForm(false)} onCarAdded={fetchCars} />
      )}
      {manageRepairsCar && (
        <ManageRepairs car={manageRepairsCar} onClose={() => setManageRepairsCar(null)} />
      )}
      {manageImagesCar && (
        <ManageImages car={manageImagesCar} onClose={() => setManageImagesCar(null)} />
      )}
      {editingCar && (
          <EditCarForm
              car={editingCar}
                  onClose={() => setEditingCar(null)}
                      onCarUpdated={fetchCars}
                        />
      )}
    </div>
  )
}

export default AdminCars