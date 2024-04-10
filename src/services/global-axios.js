import axios from 'axios'


const AUTH_API_URL = process.env.AUTH_HOST_API_URL || 'http://dev.iotlab.net.vn:5000'
// const DAM_API_URL = process.env.DAM_HOST_API_URL || 'http://172.30.37.182:8081'
// const DAM_API_URL = process.env.DAM_HOST_API_URL || 'http://localhost:8081'
const DAM_API_URL = process.env.DAM_HOST_API_URL || 'http://103.221.220.183:8084'
const GENERAL_API_URL = process.env.GENERAL_HOST_API_URL || 'http://localhost:8081'
// const GENERAL_API_URL = process.env.GENERAL_HOST_API_URL || 'http://172.30.37.167:8081'
const authApi = axios.create({
    baseURL:`${AUTH_API_URL}/api/v1`,
    timeout:10000,
    headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
})
const damApi = axios.create({
    baseURL: `${DAM_API_URL}`,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
})
const generalApi = axios.create({
    baseURL: `${GENERAL_API_URL}`,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
})
const setAuthApiHeader = () => {
    authApi.interceptors.request.use((config) => {
        const accessToken = JSON.parse(localStorage.getItem('_authenticatedUser'))?.accessToken
        config.headers['Authorization'] = accessToken
        return config
    })
}
export { authApi, damApi, generalApi, setAuthApiHeader }