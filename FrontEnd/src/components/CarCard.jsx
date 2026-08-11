import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
//import axiosInstance from '../api/axiosInstance'
import axiosInstance, { resolveImageUrl } from '../api/axiosInstance'

function CarCard({ car }) {
  const [images, setImages] = useState([])
  const [currentImage, setCurrentImage] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    fetchImages()
  }, [])

  useEffect(() => {
    if (images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 10000)

    return () => clearInterval(interval)
  }, [images])

  const fetchImages = async () => {
    try {
      const response = await axiosInstance.get(`/api/public/cars/${car.id}/images`)
      setImages(response.data)
    } catch (err) {
      setImages([])
    }
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {images.length > 0 ? (
        <img
          src={resolveImageUrl(images[currentImage].imageUrl)}
            alt={`${car.make} ${car.model}`}
              className="w-full h-40 object-cover"
              />
      ) : (
        <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-400">
          No image
        </div>
      )}

      <div className="p-4">
        <h2 className="text-lg font-bold">
          {car.make} {car.model}
        </h2>
        <p className="text-gray-600">{car.year} • {car.mileage} km</p>
        <p className="text-gray-600">Condition: {car.condition}</p>
        <p className="text-purple-600 font-bold text-xl mt-2">₹{car.price}</p>
        <p className="text-sm text-gray-500 mt-1">
          Ships from {car.shippingPort?.name}, {car.shippingPort?.country}
        </p>
        <button
          onClick={() => navigate(`/car/${car.id}`)}
          className="mt-3 w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          View Details
        </button>
      </div>
    </div>
  )
}

export default CarCard