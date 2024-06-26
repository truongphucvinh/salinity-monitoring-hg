import { damApi } from "./global-axios"

export const getAllDamTypes = () => damApi.get('/dam-types')
export const getDamTypeById = (damTypeId) => damApi.get(`/dam-types/${damTypeId}`)
export const createDamType = (damType) => damApi.post('/dam-types', damType)
export const updateDamType = (damType) => damApi.patch('/dam-types', damType)
export const deleteDamType = (damTypeId) => damApi.delete(`/dam-types/${damTypeId}`) 

export const getAllRivers = () => damApi.get('/rivers')
export const getRiverById = (riverId) => damApi.get(`/rivers/${riverId}`)
export const createRiver = (river) => damApi.post('/rivers', river)
export const updateRiver = (river) => damApi.patch('/rivers', river)
export const deleteRiver = (riverId) => damApi.delete(`/rivers/${riverId}`)

export const getAllDamStatuses = () => damApi.get('/dam-statuses')
export const getDamStatusId = (damStatusId) => damApi.get(`/dam-statuses/${damStatusId}`)
export const createDamStatus = (damStatus) => damApi.post('/dam-statuses', damStatus)
export const updateDamStatus = (damStatus) => damApi.patch('/dam-statuses', damStatus)
export const deleteDamStatus = (damStatusId) => damApi.delete(`/dam-statuses/${damStatusId}`)

export const getAllDamSchedules = (damId) => damApi.get(`/dam-schedules?damId=${damId}`)
export const getAllDamScheduleBySelectedDate = (selectedDate) => damApi.get(`/dam-schedules/selected-date/${selectedDate}`)
export const getDamScheduleId = (damScheduleId) => damApi.get(`/dam-schedules/${damScheduleId}`)
export const createDamSchedule = (damSchedule) => damApi.post('/dam-schedules', damSchedule)
export const updateDamSchedule = (damSchedule) => damApi.patch('/dam-schedules', damSchedule)
export const deleteDamSchedule = (damScheduleId) => damApi.delete(`/dam-schedules/${damScheduleId}`)
 
export const getAllDams = () => damApi.get('/dams')
export const getDamById = (damId) => damApi.get(`/dams/${damId}`)
export const createDam = (dam) => damApi.post('/dams', dam)
export const updateDam = (dam) => damApi.patch('/dams', dam)
export const deleteDam = (damId) => damApi.delete(`/dams/${damId}`)