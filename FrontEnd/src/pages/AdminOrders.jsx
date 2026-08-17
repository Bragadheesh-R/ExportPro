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

  const OrderActions = ({ order }) => (
    <>
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
    </>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />

      <div className="p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-6">Orders</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">No orders yet.</p>
        ) : (
          <>
            {/* Mobile card view */}
            <div className="flex flex-col gap-3 sm:hidden">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h2 className="font-bold">
                      {order.carMake} {order.carModel} ({order.carYear})
                    </h2>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {order.customerUsername} — {order.customerEmail}
                  </p>
                  <p className="text-sm text-gray-600">₹{order.priceAtPurchase}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <OrderActions order={order} />
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table view */}
            <div className="hidden sm:block bg-white rounded-lg shadow overflow-x-auto">
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
                      <td className="p-3 flex gap-2 flex-wrap">
                        <OrderActions order={order} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminOrders