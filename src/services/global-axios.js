import axios from 'axios'

const POST_API_URL = process.env.REACT_APP_POST_HOST_API_URL
const GENERAL_API_URL = process.env.REACT_APP_GENERAL_HOST_API_URL
const AUTH_API_URL = process.env.REACT_APP_AUTH_HOST_API_URL
const DAM_API_URL = process.env.REACT_APP_DAM_HOST_API_URL
const CAMERA_API_URL = process.env.REACT_APP_CAMERA_HOST_API_URL

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
const cameraApi = axios.create({
    baseURL: `${CAMERA_API_URL}/api/v1`,
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
const postApi = axios.create({
    baseURL: `${POST_API_URL}`,
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
export { authApi, damApi, generalApi, postApi, cameraApi, setAuthApiHeader }