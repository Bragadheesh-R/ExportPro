import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'

function Signup() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
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
      navigate('/')
    } catch (err) {
  const data = err.response?.data
  if (data?.error) {
    setError(data.error)
  } else if (data && typeof data === 'object') {
    const firstMessage = Object.values(data)[0]
    setError(firstMessage || 'Signup failed. Please check your details.')
  } else {
    setError('Signup failed. Please check your details.')
  }
} finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-lg shadow-md w-80"
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
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          required
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {submitting ? 'Creating account...' : 'Sign Up'}
        </button>

        <p className="text-sm text-gray-500 text-center mt-4">
          Already have an account?{' '}
          <Link to="/" className="text-purple-600 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Signup