import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
import CustomerNavbar from '../components/CustomerNavbar'

function ContentPage() {
  const { pageKey } = useParams()
  const [content, setContent] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchContent()
  }, [pageKey])

  const fetchContent = async () => {
    try {
      const response = await axiosInstance.get(`/api/public/content/${pageKey}`)
      setContent(response.data)
    } catch (err) {
      setError('This page has not been set up yet.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <CustomerNavbar />

      <div className="p-4 sm:p-6 max-w-3xl mx-auto">
        {error && <p className="text-gray-500">{error}</p>}
        {content && (
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-xl sm:text-2xl font-bold mb-4">{content.title}</h1>
            <div className="text-gray-700 whitespace-pre-line leading-relaxed">
              {content.body}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ContentPage