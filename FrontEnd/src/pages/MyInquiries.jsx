import { useState, useEffect } from 'react'
import axiosInstance from '../api/axiosInstance'
import CustomerNavbar from '../components/CustomerNavbar'

function MyInquiries() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    try {
      const response = await axiosInstance.get('/api/customer/inquiries')
      setInquiries(response.data)
    } catch (err) {
      setError('Failed to load your inquiries')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <CustomerNavbar />

      <div className="p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-6">My Inquiries</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {loading ? (
          <p>Loading your inquiries...</p>
        ) : inquiries.length === 0 ? (
          <p className="text-gray-500">You haven't sent any inquiries yet.</p>
        ) : (
          <div className="flex flex-col gap-3 max-w-2xl">
            {inquiries.map((inq) => (
              <div key={inq.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start">
                  <h2 className="font-bold">
                    {inq.carMake} {inq.carModel} ({inq.carYear})
                  </h2>
                  {inq.reply ? (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-medium">
                      Replied
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded font-medium">
                      Awaiting reply
                    </span>
                  )}
                </div>

                <p className="text-gray-600 mt-1">
                  {inq.message || <em className="text-gray-400">No message included</em>}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Sent: {new Date(inq.createdAt).toLocaleString()}
                </p>

                {inq.reply && (
                  <div className="mt-3 bg-purple-50 border-l-4 border-purple-500 p-3 rounded">
                    <p className="text-xs font-semibold text-purple-700 mb-1">ExportPro replied</p>
                    <p className="text-sm text-gray-700">{inq.reply}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(inq.repliedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyInquiries