import { damApi } from "./global-axios"

const getAllDams = () => damApi.get('/dams')
const getDamById = (damId) => damApi.get(`/dams/${damId}`)
const createDam = (dam) => damApi.post('/dams', dam)
const updateDam = (dam) => damApi.patch('/dams', dam)
const deleteDam = (damId) => damApi.delete(`/dams/${damId}`)

export {getAllDams, getDamById, createDam, updateDam, deleteDam}