import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'

function Signup() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    country: '',
    city: '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await axiosInstance.post('/api/auth/signup', {
        ...form,
        role: 'CUSTOMER',
      })
      navigate('/login')
    } catch (err) {
      const data = err.response?.data
      const message = typeof data === 'object' && data?.error
        ? data.error
        : typeof data === 'object'
          ? Object.values(data)[0]
          : 'Signup failed. Please check your details.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password (min 8 characters)"
          value={form.password}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          required
        />

        <input
          name="phoneNumber"
          type="tel"
          placeholder="Phone Number"
          value={form.phoneNumber}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          required
        />

        <div className="flex gap-2 mb-3">
          <input
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
            className="w-1/2 border border-gray-300 rounded px-3 py-2"
            required
          />
          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            className="w-1/2 border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 disabled:opacity-50 mt-2"
        >
          {submitting ? 'Creating account...' : 'Sign Up'}
        </button>

        <p className="text-sm text-gray-500 text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-600 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Signup