import { generalApi } from "./global-axios"

export const getAllProjects = () => generalApi.get('/projects') 
export const updateProjectById = (project) => generalApi.patch('/projects', project)

export const updatePageById = (page) => generalApi.patch(`/pages`, page)