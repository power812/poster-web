import hotkeys, { KeyHandler } from 'hotkeys-js'
import { onMounted, onUnmounted } from 'vue'
const useHotKey = (key: string, cb: KeyHandler) => {
    onMounted(() => {
        hotkeys(key, cb)
    })
    onUnmounted(() => {
        hotkeys.unbind(key, cb)
    })
}
export default useHotKey
