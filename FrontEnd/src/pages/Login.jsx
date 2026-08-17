import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await axiosInstance.post('/api/auth/login', {
        email,
        password,
      })

      const { token, username, role } = response.data

      sessionStorage.setItem('token', token)
      sessionStorage.setItem('username', username)
      sessionStorage.setItem('role', role)

      if (role === 'ADMIN') {
        navigate('/admin')
      } else {
        navigate('/shop')
      }
    } catch (err) {
      setError('Invalid email or password')
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-80"
      >
        <div className="flex items-center gap-2 mb-6">
  <img src="/logo.gif" alt="ExportPro" className="w-10 h-10" />
  <h1 className="text-2xl font-bold">ExportPro Login</h1>
</div>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          required
        />

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          Log In
        </button>
        <p className="text-sm text-gray-500 text-center mt-4">
  New here?{' '}
  <a href="/signup" className="text-purple-600 hover:underline">
    Create an account
  </a>
</p>
      </form>
    </div>
  )
}

export default Login