import { message } from 'ant-design-vue'
import { useUserStore } from '../store/user'
import axios from 'axios'
const userStore = useUserStore()

const service = axios.create({
    baseURL: process.env.BASE_URL, // url = base url + request url
    timeout: 5000, // request timeout
})

service.interceptors.request.use(
    (config) => {
        const token = userStore.token
        if (token) {
            // For reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        console.log(error, 'Have Error') // for debug
        return Promise.reject(error)
    },
)

service.interceptors.response.use(
    (response) => {
        const { data } = response
        if (data.errno !== 0) {
            return Promise.reject(new Error(data.message || 'Error'))
        } else {
            return data
        }
    },
    (error) => {
        message.error('http连接报错' + error)

        return Promise.reject(error)
    },
)

export default service
