import { cameraApi, damApi } from "./global-axios"

export const getAllCamera = (type,pageNumber,pageSize) => cameraApi.get(`/device?type=${type}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
export const createCamera = (camera) => cameraApi.post('/device', camera)