import { authApi } from './global-axios'

export const loginAuth = (user) => authApi.post('/auth/token', user)
export const getAllUsers = () => authApi.get('/users')
export const getUserById = (userId) => authApi.get(`/users/${userId}`)
export const getAllRoles = () => authApi.get('/roles')
export const getAllDomains = () => authApi.get('/domains')

export const createUser = (user) => authApi.post('/users', user)
export const updateUser = (user, userId) => authApi.patch(`/users/${userId}`, user)