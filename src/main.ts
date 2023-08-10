import { createApp } from 'vue'
import App from './App.vue'
import 'ant-design-vue/dist/antd.css'
import 'cropperjs/dist/cropper.css'
import router from './router'
import { createPinia } from 'pinia'
import './style/inidex.css'
import configAnt from './config/configAnt'
// import legoBricks from 'lego-bricks'
import Lego from 'lego-components'

// 加载样式
import 'lego-components/dist/lego-components.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia).use(Lego).use(router).use(configAnt).mount('#app')
import axios from 'axios'
import { useGlobalStore } from '../src/store/global'
import { message } from 'ant-design-vue'
let baseBackendUrl
if (process.env.NODE_ENV === 'development') {
    baseBackendUrl = 'http://127.0.0.1:5173/api/'
} else {
    baseBackendUrl = 'http://120.78.65.45:5173/api/'
}
// const baseBackendUrl = 'http://182.92.168.192:8081/api/'
axios.defaults.baseURL = baseBackendUrl
const globalStore = useGlobalStore()
axios.interceptors.request.use((config) => {
    globalStore.startLoading()
    return config
})
axios.interceptors.response.use(
    (resp) => {
        globalStore.finishLoading()
        const { data } = resp
        if (data.errno !== 0) {
            console.log(data)
            message.error(data.msg || '后端接口返回错误')
            return Promise.reject(data)
        }
        return data
    },
    (error) => {
        return Promise.reject(error)
    },
)
