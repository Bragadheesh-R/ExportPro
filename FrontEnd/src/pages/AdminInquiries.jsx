import { useState, useEffect } from 'react'
import axiosInstance from '../api/axiosInstance'
import AdminNavbar from '../components/AdminNavbar'

function AdminInquiries() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [submitting, setSubmitting] = useState(false)

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

  const openReply = (inq) => {
    setReplyingTo(inq.id)
    setReplyText(inq.reply || '')
  }

  const handleSendReply = async (id) => {
    setSubmitting(true)
    setError('')
    try {
      await axiosInstance.put(`/api/admin/inquiries/${id}/reply`, { reply: replyText })
      setReplyingTo(null)
      setReplyText('')
      fetchInquiries()
    } catch (err) {
      setError('Failed to send reply')
    } finally {
      setSubmitting(false)
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
          <div className="flex flex-col gap-3">
            {inquiries.map((inq) => (
              <div key={inq.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <h2 className="font-bold">
                      {inq.carMake} {inq.carModel} ({inq.carYear})
                    </h2>
                    <p className="text-sm text-gray-500">
                      {inq.customerUsername} — {inq.customerEmail}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(inq.createdAt).toLocaleString()}
                  </span>
                </div>

                <p className="mt-2 text-gray-700">
                  {inq.message || <em className="text-gray-400">No message</em>}
                </p>

                {inq.reply && (
                  <div className="mt-3 bg-purple-50 border-l-4 border-purple-500 p-3 rounded">
                    <p className="text-xs font-semibold text-purple-700 mb-1">Your reply</p>
                    <p className="text-sm text-gray-700">{inq.reply}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(inq.repliedAt).toLocaleString()}
                    </p>
                  </div>
                )}

                {replyingTo === inq.id ? (
                  <div className="mt-3">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full border rounded px-3 py-2 text-sm"
                      rows="3"
                      placeholder="Write your reply..."
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleSendReply(inq.id)}
                        disabled={submitting || !replyText.trim()}
                        className="bg-purple-600 text-white px-4 py-1.5 rounded text-sm hover:bg-purple-700 disabled:opacity-50"
                      >
                        {submitting ? 'Sending...' : 'Send Reply'}
                      </button>
                      <button
                        onClick={() => setReplyingTo(null)}
                        className="bg-gray-300 px-4 py-1.5 rounded text-sm hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => openReply(inq)}
                    className="mt-3 text-purple-600 text-sm hover:underline"
                  >
                    {inq.reply ? 'Edit Reply' : 'Reply'}
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

export default AdminInquiries