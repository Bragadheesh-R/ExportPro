import { useState, useEffect } from 'react'
import axiosInstance from '../api/axiosInstance'
import CustomerNavbar from '../components/CustomerNavbar'

function MyOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get('/api/customer/orders')
      setOrders(response.data)
    } catch (err) {
      setError('Failed to load your orders')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadInvoice = async (id) => {
    try {
      const response = await axiosInstance.get(`/api/customer/orders/${id}/invoice`, {
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
      setError('Invoice not available yet')
    }
  }

  const statusColor = {
    RESERVED: 'bg-yellow-100 text-yellow-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <CustomerNavbar />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {loading ? (
          <p>Loading your orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">You haven't placed any orders yet.</p>
        ) : (
          <div className="flex flex-col gap-4 max-w-2xl">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="font-bold text-lg">
                    {order.car.make} {order.car.model} ({order.car.year})
                  </h2>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor[order.status]}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-gray-600">Price: ₹{order.priceAtPurchase}</p>
                <p className="text-sm text-gray-500">
                  Ordered: {new Date(order.createdAt).toLocaleString()}
                </p>
                {order.status === 'COMPLETED' && (
                  <button
                    onClick={() => handleDownloadInvoice(order.id)}
                    className="mt-3 bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700"
                  >
                    Download Invoice
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrders