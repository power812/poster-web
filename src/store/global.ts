import { defineStore } from 'pinia'
// interface GlobalStateType {
//     requestNumber: number
// }
export const useGlobalStore = defineStore('globalStore', {
    state: () => {
        return {
            requestNumber: 0,
        }
    },
    getters: {
        isLoading(state) {
            return state.requestNumber > 0
        },
    },
    actions: {
        startLoading() {
            this.requestNumber++
        },
        finishLoading() {
            setTimeout(() => {
                this.requestNumber--
            }, 1000)
        },
    },
})
