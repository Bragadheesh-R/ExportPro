import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'

function CarDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const [images, setImages] = useState([])
  const [currentImage, setCurrentImage] = useState(0)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [repairs, setRepairs] = useState([])

  useEffect(() => {
    fetchCar()
  }, [id])

  const fetchCar = async () => {
    try {
      const response = await axiosInstance.get(`/api/public/cars/${id}`)
      setCar(response.data)

      const imagesResponse = await axiosInstance.get(`/api/public/cars/${id}/images`)
      setImages(imagesResponse.data)

      const repairsResponse = await axiosInstance.get(`/api/public/cars/${id}/repairs`)
      setRepairs(repairsResponse.data)
    } catch (err) {
      setError('Car not found or no longer available')
    }
  }

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleInquire = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      await axiosInstance.post('/api/customer/inquiries', {
        carId: parseInt(id),
        message,
      })
      setSuccess('Inquiry sent! Our team will contact you soon.')
      setMessage('')
    } catch (err) {
      setError('Failed to send inquiry. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (error && !car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button
        onClick={() => navigate('/shop')}
        className="mb-4 text-purple-600 hover:underline"
      >
        ← Back to Shop
      </button>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
        {images.length > 0 ? (
          <div className="relative mb-4">
            <img
              src={images[currentImage].imageUrl}
              alt={`${car.make} ${car.model}`}
              className="w-full h-72 object-cover rounded"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white w-8 h-8 rounded-full hover:bg-black/70"
                >
                  ‹
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white w-8 h-8 rounded-full hover:bg-black/70"
                >
                  ›
                </button>

                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`w-2 h-2 rounded-full ${index === currentImage ? 'bg-white' : 'bg-white/50'
                        }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="w-full h-72 bg-gray-200 rounded flex items-center justify-center text-gray-400 mb-4">
            No images available
          </div>
        )}

        <h1 className="text-2xl font-bold mb-2">
          {car.make} {car.model}
        </h1>
        <p className="text-gray-600 mb-1">Year: {car.year}</p>
        <p className="text-gray-600 mb-1">Mileage: {car.mileage} km</p>
        <p className="text-gray-600 mb-1">Condition: {car.condition}</p>
        <p className="text-gray-600 mb-1">VIN: {car.vin}</p>
        <p className="text-gray-600 mb-3">
          Ships from {car.shippingPort?.name}, {car.shippingPort?.country}
        </p>
        <p className="text-purple-600 font-bold text-2xl mb-6">₹{car.price}</p>
        {repairs.length > 0 && (
          <div className="border-t pt-4 mb-6">
            <h2 className="font-semibold mb-2">Repair &amp; Inspection History</h2>
            <div className="flex flex-col gap-2">
              {repairs.map((r) => (
                <div key={r.id} className="bg-gray-50 rounded p-3 text-sm">
                  <p className="font-medium">{r.description}</p>
                  <p className="text-gray-500">
                    {r.repairDate} • ₹{r.cost} • by {r.performedBy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleInquire} className="border-t pt-4">
          <h2 className="font-semibold mb-2">Interested in this car?</h2>

          {success && <p className="text-green-600 text-sm mb-3">{success}</p>}
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <textarea
            placeholder="Add a message (optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-3"
            rows="3"
          />

          <button
            type="submit"
            disabled={submitting}
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {submitting ? 'Sending...' : 'Send Inquiry'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CarDetail