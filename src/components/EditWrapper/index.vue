<template>
    <div
        v-if="!isHidden"
        ref="currentElement"
        :style="wrapPosition"
        class="edit-wrapper"
        @click.stop="handleEmitData"
        :class="{ active }"
        @mousedown="startMove"
    >
        <slot></slot>
        <div class="resizers" v-if="showResize">
            <div class="resizer top-left" @mousedown.stop="startResize('top-left')"></div>
            <div class="resizer top-right" @mousedown.stop="startResize('top-right')"></div>
            <div class="resizer bottom-left" @mousedown.stop="startResize('bottom-left')"></div>
            <div class="resizer bottom-right" @mousedown.stop="startResize('bottom-right')"></div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'
import useEditorStore from '../../store/editor'
import { pick } from 'lodash-es'

const editStore = useEditorStore()
const props = defineProps<{ id: string; isHidden?: boolean; props: Object }>()
// 获取定位属性
const wrapPosition = computed(() => pick(props.props, ['position', 'left', 'top', 'bottom', 'left']))
// 发送数据
const emits = defineEmits(['sendItemData', 'updatePosition'])
const handleEmitData = () => {
    emits('sendItemData', props.id)
}
// 选中高亮
const active = computed(() => props.id === editStore.currentElementId)
// ===========================
// 拖动移动
const currentElement = ref<HTMLElement>()
const showResize = ref(false)
const startMove = (e: MouseEvent) => {
    e.preventDefault()
    showResize.value = true
    const grap = { x: 0, y: 0 }
    let isMove = false
    if (currentElement.value) {
        const { left, top } = currentElement.value.getBoundingClientRect()
        grap.x = e.clientX - left
        grap.y = e.clientY - top
    }
    // 鼠标移动
    const handleMove = (e: MouseEvent) => {
        isMove = true
        // 获取画布的距离
        const canvasArea = document.getElementById('canvas-area') as HTMLElement
        const { left, top } = canvasArea.getBoundingClientRect()
        const elementLeft = e.clientX - left - grap.x
        const elementTop = e.clientY - top - grap.y
        console.log(elementLeft)
        // 设置位置
        if (currentElement.value) {
            currentElement.value.style.left = elementLeft + 'px'
            currentElement.value.style.top = elementTop + 'px'
        }
    }
    document.addEventListener('mousemove', handleMove)
    // 松开鼠标
    const handleUp = async () => {
        if (currentElement.value && isMove) {
            const { left, top } = currentElement.value.style
            emits('updatePosition', { left, top, id: props.id })
            isMove = false
        }
        document.removeEventListener('mousemove', handleMove)
        await nextTick()
        document.removeEventListener('mouseup', handleUp)
    }
    document.addEventListener('mouseup', handleUp)
}
// ===========================
// 拖动改变大小
type ResizeDirection = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
interface OriginalPositions {
    left: number
    right: number
    top: number
    bottom: number
}
const startResize = (direction: ResizeDirection) => {
    const ele = currentElement.value as HTMLElement
    const { left, right, top, bottom } = ele.getBoundingClientRect()

    const handleResizeMove = (e: MouseEvent) => {
        const { style } = ele
        const size = caculateSize(direction, e, { left, right, top, bottom })
        if (size) {
            style.width = size.width + 'px'
            style.height = size.height + 'px'
            if (size.left) {
                style.left = size.left + 'px'
            }
            if (size.top) {
                style.top = size.top + 'px'
            }
        }
    }
    const handleUp = async (e: MouseEvent) => {
        document.removeEventListener('mousemove', handleResizeMove)
        const size = caculateSize(direction, e, { left, right, top, bottom })
        emits('updatePosition', { ...size, id: props.id })
        await nextTick()
        document.removeEventListener('mouseup', handleUp)
    }
    document.addEventListener('mousemove', handleResizeMove)
    document.addEventListener('mouseup', handleUp)
}
// 计算不同方向的尺寸
const caculateSize = (direction: ResizeDirection, e: MouseEvent, positions: OriginalPositions) => {
    const { clientX, clientY } = e
    const { left, right, top, bottom } = positions
    const container = document.getElementById('canvas-area') as HTMLElement
    const rightWidth = clientX - left
    const leftWidth = right - clientX
    const bottomHeight = clientY - top
    const topHeight = bottom - clientY
    const topOffset = clientY - container.getBoundingClientRect().top + container.scrollTop
    const leftOffset = clientX - container.getBoundingClientRect().left
    switch (direction) {
        case 'top-left':
            return {
                width: leftWidth,
                height: topHeight,
                top: topOffset,
                left: leftOffset,
            }
        case 'top-right':
            return {
                width: rightWidth,
                height: topHeight,
                top: topOffset,
            }
        case 'bottom-left':
            return {
                width: leftWidth,
                height: bottomHeight,
                left: leftOffset,
            }
        case 'bottom-right':
            return {
                width: rightWidth,
                height: bottomHeight,
            }
        default:
            break
    }
}
// 添加快捷键
</script>
<style scoped lang="scss">
.edit-wrapper {
    position: absolute;
    :deep(> *) {
        width: 100% !important;
        height: 100% !important;
    }
    &.canvas-fix {
        :deep(> *) {
            box-shadow: none !important;
        }
    }
    .resizer {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #fff;
        border: 3px solid #1890ff;
        position: absolute;
        &.top-left {
            left: -5px;
            top: -5px;
            cursor: nwse-resize;
        }
        &.bottom-right {
            right: -5px;
            bottom: -5px;
            cursor: nwse-resize;
        }
        &.top-right {
            right: -5px;
            top: -5px;
            cursor: nesw-resize;
        }
        &.bottom-left {
            left: -5px;
            bottom: -5px;
            cursor: nesw-resize;
        }
    }
}

.edit-wrapper.active {
    border: 1px solid #1890ff;
    user-select: none;
    z-index: 1500;
}
</style>
