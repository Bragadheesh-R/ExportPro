import { useState, useEffect } from 'react'
import axiosInstance from '../api/axiosInstance'
import AdminNavbar from '../components/AdminNavbar'

const PAGES = [
  { key: 'about', label: 'About Us' },
  { key: 'export-procedure', label: 'Export Procedure' },
]

function AdminContent() {
  const [forms, setForms] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingKey, setSavingKey] = useState(null)
  const [savedKey, setSavedKey] = useState(null)

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    const results = {}
    for (const page of PAGES) {
      try {
        const response = await axiosInstance.get(`/api/public/content/${page.key}`)
        results[page.key] = { title: response.data.title, body: response.data.body }
      } catch (err) {
        results[page.key] = { title: page.label, body: '' }
      }
    }
    setForms(results)
    setLoading(false)
  }

  const handleChange = (key, field, value) => {
    setForms({ ...forms, [key]: { ...forms[key], [field]: value } })
  }

  const handleSave = async (key) => {
    setSavingKey(key)
    setSavedKey(null)
    setError('')
    try {
      await axiosInstance.put(`/api/admin/content/${key}`, forms[key])
      setSavedKey(key)
      setTimeout(() => setSavedKey(null), 2000)
    } catch (err) {
      setError('Failed to save content')
    } finally {
      setSavingKey(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />

      <div className="p-4 sm:p-6 max-w-3xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold mb-6">Manage Site Content</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="flex flex-col gap-6">
            {PAGES.map((page) => (
              <div key={page.key} className="bg-white rounded-lg shadow p-4">
                <h2 className="font-semibold mb-3">{page.label}</h2>

                <label className="text-sm text-gray-500">Page Title</label>
                <input
                  value={forms[page.key]?.title || ''}
                  onChange={(e) => handleChange(page.key, 'title', e.target.value)}
                  className="w-full border rounded px-3 py-2 mb-3"
                />

                <label className="text-sm text-gray-500">Content</label>
                <textarea
                  value={forms[page.key]?.body || ''}
                  onChange={(e) => handleChange(page.key, 'body', e.target.value)}
                  rows="8"
                  className="w-full border rounded px-3 py-2"
                />

                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => handleSave(page.key)}
                    disabled={savingKey === page.key}
                    className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700 disabled:opacity-50"
                  >
                    {savingKey === page.key ? 'Saving...' : 'Save'}
                  </button>
                  {savedKey === page.key && (
                    <span className="text-green-600 text-sm">Saved!</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminContent