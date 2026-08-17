import axios from 'axios'

const getBackendBaseUrl = () => {
  const { origin } = window.location

  if (origin.includes('.app.github.dev')) {
    return origin.replace('-5173.', '-8080.')
  }

  return 'http://localhost:8080'
}

export const resolveImageUrl = (path) => {
  if (!path) return path
  return path.startsWith('http') ? path : `${getBackendBaseUrl()}${path}`
}

const axiosInstance = axios.create({
  baseURL: getBackendBaseUrl(),
})

axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default axiosInstance