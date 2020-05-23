import { get, post, postForm } from './http'

// 登录
export const login = params => post('/v1/admin/login', params)

// 获取分类列表
export const getCategories = params => get('/v1/category', params)

// 修改分类信息
export const updateCategory = params => post('/v1/category/update', params)

// 删除分类
export const deleteCategory = params => post('/v1/category/delete', params)

// 添加分类
export const addCategory = params => post('/v1/category/add', params)

// 获取专题列表
export const getThemes = params => get('/v1/theme', params)

// 删除专题
export const deleteTheme = params => post('/v1/theme/delete', params)

// 添加专题
export const addTheme = params => post('/v1/theme/add', params)

// 获取产品列表
export const getProducts = params => get('/v1/product', params)

// 修改产品信息
export const updateProduct = params => post('/v1/product/update', params)

// 添加商品
export const addProduct = params => post('/v1/product/add', params)

// 删除产品
export const deleteProduct = params => post('/v1/product/delete', params)

// 上传图片
export const upLoadImg = params => postForm('/v1/image/upload', params)
