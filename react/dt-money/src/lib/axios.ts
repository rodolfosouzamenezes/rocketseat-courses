import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API || 'http://localhost:3333',
})
