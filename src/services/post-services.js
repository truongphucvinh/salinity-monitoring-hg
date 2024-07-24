import { postApi } from "./global-axios"

export const getAllPosts = () => postApi.get('/posts/all-posts')
export const getPostById = (postId) => postApi.get(`/posts/${postId}`)
export const createPost = (post) => postApi.post('/posts', post)
export const updatePost = (post) => postApi.patch('/posts', post)
export const decidePost = (post) => postApi.patch('/posts', post)
export const deletePost = (postId) => postApi.delete(`/posts/${postId}`) 

export const getAllTags = () => postApi.get('/tags')
export const getTagById = (tagId) => postApi.get(`/tags/${tagId}`)
export const createTag = (tag) => postApi.post('/tags', tag)
export const updateTag = (tag) => postApi.patch('/tags', tag)
export const deleteTag = (tagId) => postApi.delete(`/tags/${tagId}`)