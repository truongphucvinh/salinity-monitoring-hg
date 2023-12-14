import { authApi } from './global-axios'

const loginAuth = (user) => authApi.post('/auth/token', user)
const getAllUsers = () => authApi.get('/users')
const getUserById = (userId) => authApi.get(`/users/${userId}`)
const getAllRoles = () => authApi.get('/roles')
const getAllDomains = () => authApi.get('/domains')

export { loginAuth, getAllUsers, getUserById, getAllDomains, getAllRoles }