import axios from 'axios'

export const BACKEND_ORIGIN =
  'https://redesigned-guide-5gq967j75x6q24qx5-8080.app.github.dev'

export const resolveImageUrl = (path) => {
  if (!path) return ''

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  return `${BACKEND_ORIGIN}${path}`
}

const axiosInstance = axios.create({
  baseURL: BACKEND_ORIGIN,
})

axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default axiosInstance