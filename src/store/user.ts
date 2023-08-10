import axios from 'axios'
import { defineStore } from 'pinia'
interface userInfoType {
    nickname: string
}
interface userStoreType {
    loginButtonStatus: boolean
    isLogin: boolean
    token: string
    userInfo: userInfoType
}
interface payloadType {
    phoneNumber: string
    veriCode: string
}

export const useUserStore = defineStore({
    id: 'user',
    state: (): userStoreType => ({
        isLogin: false,
        userInfo: {} as userInfoType,
        loginButtonStatus: false,
        token: localStorage.getItem('token') || '',
    }),
    actions: {
        login: async function (payload: payloadType) {
            const res = await axios.post('/users/loginByPhoneNumber', payload)
            console.log(res)
            this.token = res.data.token || ''
            localStorage.setItem('token', this.token)
            this.isLogin = true
            axios.defaults.headers.common.Authorization = `Bearer ${this.token}`
            return this.token
        },
        fetchCurrentUser: async function () {
            const res = await axios.get('/users/getUserInfo')
            this.userInfo = res.data.userData

            return this.userInfo
        },
        loginAndFetch: async function (payload: payloadType) {
            try {
                await this.login(payload)
                await this.fetchCurrentUser()
            } catch (e) {
                this.loginButtonStatus = false
                return Promise.reject(e)
            }
        },
        logout() {
            this.token = ''
            localStorage.removeItem('token')
            this.isLogin = false
            delete axios.defaults.headers.common.Authorization
        },
    },
})
