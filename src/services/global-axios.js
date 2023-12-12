import axios from 'axios'
const AUTH_API_URL = process.env.AUTH_HOST_API_URL || 'http://dev.iotlab.net.vn:5000'
const authApi = axios.create({
    baseURL:`${AUTH_API_URL}/api/v1`,
    timeout:10000,
    headers:{
        'Content-Type': 'application/json'
    }
})
authApi.interceptors.request.use((config) => {
    config.headers['Authorization'] = localStorage.getItem('_accessToken')
    return config
})
export { authApi }