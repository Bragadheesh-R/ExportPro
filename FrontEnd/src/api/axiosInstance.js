import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://redesigned-guide-5gq967j75x6q24qx5-8080.app.github.dev',
})

axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default axiosInstance