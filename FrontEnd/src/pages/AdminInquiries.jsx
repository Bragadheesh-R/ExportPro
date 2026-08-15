import { useState, useEffect } from 'react'
import axiosInstance from '../api/axiosInstance'
import AdminNavbar from '../components/AdminNavbar'

function AdminInquiries() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    try {
      const response = await axiosInstance.get('/api/admin/inquiries')
      setInquiries(response.data)
    } catch (err) {
      setError('Failed to load inquiries')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Customer Inquiries</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {loading ? (
          <p>Loading inquiries...</p>
        ) : inquiries.length === 0 ? (
          <p className="text-gray-500">No inquiries yet.</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3">Car</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Message</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inq) => (
                  <tr key={inq.id} className="border-t">
                    <td className="p-3">
                      {inq.car?.make} {inq.car?.model} ({inq.car?.year})
                    </td>
                    <td className="p-3">
                      {inq.customer?.username} <br />
                      <span className="text-gray-500 text-sm">{inq.customer?.email}</span>
                    </td>
                    <td className="p-3">{inq.message || <em className="text-gray-400">No message</em>}</td>
                    <td className="p-3 text-sm text-gray-500">
                      {new Date(inq.createdAt).toLocaleString()}
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

export default AdminInquiries