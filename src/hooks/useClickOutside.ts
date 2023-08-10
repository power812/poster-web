import { Ref, onMounted, onUnmounted, ref } from 'vue'

const useClickOutside = (elementRef: Ref<null | HTMLElement>) => {
    const isClickOutside = ref(false)
    const handleClick = (e: MouseEvent) => {
        if (elementRef.value && elementRef.value?.contains(e.target as HTMLElement)) {
            isClickOutside.value = false
        } else {
            isClickOutside.value = true
        }
    }

    onMounted(() => {
        document.addEventListener('click', handleClick)
    })
    onUnmounted(() => {
        document.removeEventListener('click', handleClick)
    })
    return isClickOutside
}
export default useClickOutside
