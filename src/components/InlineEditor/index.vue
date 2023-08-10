<template>
    <div class="inline-edit" ref="wrapper" @click.stop="handleClick">
        <input v-model="innerValue" v-if="isEditing" placeholder="文本不能为空" ref="inputRef" class="ant-input" />
        <slot v-else :text="innerValue">
            <span>{{ innerValue }}</span>
        </slot>
    </div>
</template>
<script setup lang="ts">
import useKeyPress from '../../hooks/useKeyPress'
import { ref, watch } from 'vue'
import useClickOutside from '../../hooks/useClickOutside'
const isEditing = ref(false)
const emits = defineEmits(['change'])
const wrapper = ref(null)
const isOutside = useClickOutside(wrapper)
watch(isOutside, (newValue) => {
    if (newValue && isEditing) {
        isEditing.value = false
    }
    // 点击外侧无法还原bug
    isOutside.value = false
})
useKeyPress('Enter', () => {
    isEditing.value = false
    emits('change', innerValue)
})
let chachValue = ''
useKeyPress('Escape', () => {
    isEditing.value = false
    innerValue.value = chachValue
})
const handleClick = () => {
    isEditing.value = true
    chachValue = innerValue.value
    innerValue.value = props.value
}

const props = defineProps<{ value: string }>()
const innerValue = ref(props.value)
</script>
