import { authApi } from './global-axios'

export const loginAuth = (user) => authApi.post('/auth/token', user)
export const getAllUsers = () => authApi.get('/users')
export const getUserById = (userId) => authApi.get(`/users/${userId}`)
export const getAllRoles = () => authApi.get('/roles')
export const getRoleById = (roleId) => authApi.get(`/roles/${roleId}`)
export const getAllDomains = () => authApi.get('/domains')
export const getAllPermissions = () => authApi.get('/permissions')

export const createUser = (user) => authApi.post('/users', user)
export const updateUser = (user, userId) => authApi.patch(`/users/${userId}`, user)
export const deleteUser = (userId) => authApi.delete(`/users/${userId}`)
export const createRole = (role) => authApi.post('/roles', role)
export const updateRole = (role, roleId) => authApi.patch(`/roles/${roleId}`, role)
export const createPermission = (permission) => authApi.post('/permissions', permission)
export const updatePermission = (permission, permissionId) => authApi.patch(`/permissions/${permissionId}`, permission)
