import { generalApi } from "./global-axios"

export const getAllProjects = () => generalApi.get('/projects') 

export const updatePageById = (page) => generalApi.patch(`/pages`, page)