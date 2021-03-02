import axios, { AxiosRequestConfig } from 'axios'

/*
 * copied and updated from AxiosInstance type
 */
export interface CustomAxios {
  (config: AxiosRequestConfig): Promise<any>
  (url: string, config?: AxiosRequestConfig): Promise<any>
  defaults: AxiosRequestConfig
  getUri(config?: AxiosRequestConfig): string
  request<T = any>(config: AxiosRequestConfig): Promise<T>
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
  head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
  options<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
}

const client = axios.create({
  baseURL: process.env.BACKEND_API,
})

client.interceptors.response.use((r) => {
  return r.data
})

export default (client as unknown) as CustomAxios
