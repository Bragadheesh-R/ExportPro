import { useState, useEffect } from 'react'
import axiosInstance from '../api/axiosInstance'

function ManageImages({ car, onClose }) {
  const [images, setImages] = useState([])
  const [imageUrl, setImageUrl] = useState('')
  const [isMain, setIsMain] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const response = await axiosInstance.get(`/api/admin/cars/${car.id}/images`)
      setImages(response.data)
    } catch (err) {
      setError('Failed to load images')
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await axiosInstance.post(`/api/admin/cars/${car.id}/images`, {
        imageUrl,
        isMain,
      })
      setImageUrl('')
      setIsMain(false)
      fetchImages()
    } catch (err) {
      setError('Failed to add image. Check the URL.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (imageId) => {
    try {
      await axiosInstance.delete(`/api/admin/cars/${car.id}/images/${imageId}`)
      fetchImages()
    } catch (err) {
      setError('Failed to delete image')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          Images for {car.make} {car.model}
        </h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <div className="grid grid-cols-2 gap-2 mb-4">
          {images.map((img) => (
            <div key={img.id} className="relative">
              <img
                src={img.imageUrl}
                alt="Car"
                className="w-full h-24 object-cover rounded border"
                onError={(e) => (e.target.src = 'https://placehold.co/200x150?text=Invalid+URL')}
              />
              {img.isMain && (
                <span className="absolute top-1 left-1 bg-purple-600 text-white text-xs px-2 py-0.5 rounded">
                  Main
                </span>
              )}
              <button
                onClick={() => handleDelete(img.id)}
                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handleAdd} className="flex flex-col gap-3 border-t pt-4">
          <input
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="border rounded px-3 py-2"
            required
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isMain}
              onChange={(e) => setIsMain(e.target.checked)}
            />
            Set as main photo
          </label>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-purple-600 text-white py-2 rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {submitting ? 'Adding...' : 'Add Image'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ManageImages