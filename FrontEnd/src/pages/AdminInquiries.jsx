import { useState, useEffect, useMemo } from 'react'
import axiosInstance from '../api/axiosInstance'
import AdminNavbar from '../components/AdminNavbar'

function AdminInquiries() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedEmail, setSelectedEmail] = useState(null)
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

  const conversations = useMemo(() => {
    const groups = {}
    for (const inq of inquiries) {
      if (!groups[inq.customerEmail]) {
        groups[inq.customerEmail] = {
          email: inq.customerEmail,
          username: inq.customerUsername,
          items: [],
        }
      }
      groups[inq.customerEmail].items.push(inq)
    }
    return Object.values(groups)
      .map((c) => ({
        ...c,
        items: c.items.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
      }))
      .sort((a, b) => {
        const aLast = a.items[a.items.length - 1].createdAt
        const bLast = b.items[b.items.length - 1].createdAt
        return new Date(bLast) - new Date(aLast)
      })
  }, [inquiries])

  const selectedThread = conversations.find((c) => c.email === selectedEmail)

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

      <div className="p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">Customer Inquiries</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {loading ? (
          <p>Loading inquiries...</p>
        ) : conversations.length === 0 ? (
          <p className="text-gray-500">No inquiries yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white rounded-lg shadow overflow-hidden" style={{ minHeight: '500px' }}>

            {/* Customer list - hidden on mobile once a thread is open */}
            <div className={`md:col-span-1 border-r ${selectedEmail ? 'hidden md:block' : ''}`}>
              {conversations.map((c) => {
                const last = c.items[c.items.length - 1]
                const unreplied = c.items.filter((i) => !i.reply).length
                return (
                  <button
                    key={c.email}
                    onClick={() => setSelectedEmail(c.email)}
                    className={`w-full text-left p-4 border-b hover:bg-gray-50 ${
                      selectedEmail === c.email ? 'bg-purple-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-semibold">{c.username}</span>
                      {unreplied > 0 && (
                        <span className="bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {unreplied}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{c.email}</p>
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {last.carMake} {last.carModel}: {last.message || 'No message'}
                    </p>
                  </button>
                )
              })}
            </div>

            {/* Thread view */}
            <div className={`md:col-span-2 flex flex-col ${!selectedEmail ? 'hidden md:flex' : ''}`}>
              {!selectedThread ? (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  Select a customer to view their messages
                </div>
              ) : (
                <>
                  <div className="border-b p-4 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedEmail(null)}
                      className="md:hidden text-purple-600"
                    >
                      ←
                    </button>
                    <div>
                      <p className="font-semibold">{selectedThread.username}</p>
                      <p className="text-xs text-gray-500">{selectedThread.email}</p>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                    {selectedThread.items.map((inq) => (
                      <div key={inq.id}>
                        <p className="text-xs text-gray-400 mb-1">
                          {inq.carMake} {inq.carModel} ({inq.carYear}) • {new Date(inq.createdAt).toLocaleString()}
                        </p>

                        <div className="bg-gray-100 rounded-lg rounded-tl-none p-3 max-w-md">
                          <p className="text-sm text-gray-700">
                            {inq.message || <em className="text-gray-400">No message</em>}
                          </p>
                        </div>

                        {inq.reply && (
                          <div className="bg-purple-600 text-white rounded-lg rounded-tr-none p-3 max-w-md ml-auto mt-2">
                            <p className="text-sm">{inq.reply}</p>
                            <p className="text-xs text-purple-200 mt-1">
                              {new Date(inq.repliedAt).toLocaleString()}
                            </p>
                          </div>
                        )}

                        {replyingTo === inq.id ? (
                          <div className="mt-2 ml-auto max-w-md">
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              className="w-full border rounded px-3 py-2 text-sm"
                              rows="2"
                              placeholder="Write your reply..."
                            />
                            <div className="flex gap-2 mt-1 justify-end">
                              <button
                                onClick={() => handleSendReply(inq.id)}
                                disabled={submitting || !replyText.trim()}
                                className="bg-purple-600 text-white px-3 py-1 rounded text-xs hover:bg-purple-700 disabled:opacity-50"
                              >
                                Send
                              </button>
                              <button
                                onClick={() => setReplyingTo(null)}
                                className="bg-gray-300 px-3 py-1 rounded text-xs hover:bg-gray-400"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-right mt-1">
                            <button
                              onClick={() => openReply(inq)}
                              className="text-purple-600 text-xs hover:underline"
                            >
                              {inq.reply ? 'Edit reply' : 'Reply'}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminInquiries