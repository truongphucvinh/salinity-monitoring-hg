import { authApi } from './global-axios'
const loginAuth = (user) => authApi.post('/auth/token', user)
export { loginAuth }