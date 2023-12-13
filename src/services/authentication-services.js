import { authApi } from './global-axios'

const loginAuth = (user) => authApi.post('/auth/token', user)
const getAllUsers = () => authApi.get('/users')
const getUserById = (userId) => authApi.get(`/users/${userId}`)



export { loginAuth, getAllUsers, getUserById }