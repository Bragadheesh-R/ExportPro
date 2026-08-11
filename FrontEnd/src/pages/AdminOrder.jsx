import { useState, useEffect } from 'react'
import axiosInstance from '../api/axiosInstance'
import AdminNavbar from '../components/AdminNavbar'

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get('/api/admin/orders')
      setOrders(response.data)
    } catch (err) {
      setError('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmPayment = async (id) => {
    try {
      await axiosInstance.put(`/api/admin/orders/${id}/confirm-payment`)
      fetchOrders()
    } catch (err) {
      setError('Failed to confirm payment')
    }
  }

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this order? The car will become available again.')) return
    try {
      await axiosInstance.put(`/api/admin/orders/${id}/cancel`)
      fetchOrders()
    } catch (err) {
      setError('Failed to cancel order')
    }
  }

  const handleDownloadInvoice = async (id) => {
    try {
      const response = await axiosInstance.get(`/api/admin/orders/${id}/invoice`, {
        responseType: 'blob',
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `invoice-${id}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      setError('Failed to download invoice')
    }
  }

  const statusColor = {
    RESERVED: 'bg-yellow-100 text-yellow-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Orders</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">No orders yet.</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3">Car</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t">
                    <td className="p-3">
                      {order.carMake} {order.carModel} ({order.carYear})
                    </td>
                    <td className="p-3">
                      {order.customerUsername}
                      <br />
                      <span className="text-gray-500 text-sm">{order.customerEmail}</span>
                    </td>
                    <td className="p-3">₹{order.priceAtPurchase}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3 flex gap-2">
                      {order.status === 'RESERVED' && (
                        <>
                          <button
                            onClick={() => handleConfirmPayment(order.id)}
                            className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                          >
                            Confirm Payment
                          </button>
                          <button
                            onClick={() => handleCancel(order.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {order.status === 'COMPLETED' && (
                        <button
                          onClick={() => handleDownloadInvoice(order.id)}
                          className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                        >
                          Download Invoice
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminOrders