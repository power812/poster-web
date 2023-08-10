<template>
    <ul class="ant-list-items ant-list-bordered">
        <li
            :class="{ ghost: dragData.currentDraggingId === item.id }"
            @click="handleSelect(item.id)"
            v-for="(item, index) in props.list"
            :key="item.id"
            class="ant-list-item"
            draggable="true"
            @dragstart="handleDragStart(item.id, index)"
            @drop="handleDrop"
            @dragover="handleDragOver"
            @dragenter="handleEnter"
            :data-index="index"
        >
            <a-tooltip :title="item.isHidden ? '显示' : '隐藏'">
                <a-button shape="circle" @click.stop="handleChange('isHidden', !item.isHidden, true, item.id)">
                    <template #icon v-if="item.isHidden"><EyeOutlined /></template>
                    <template #icon v-else><EyeInvisibleOutlined /></template>
                </a-button>
            </a-tooltip>
            <a-tooltip :title="item.isLocked ? '解锁' : '锁定'">
                <a-button shape="circle" @click.stop="handleChange('isLocked', !item.isLocked, true, item.id)">
                    <template #icon v-if="item.isLocked"><UnlockOutlined /></template>
                    <template #icon v-else><LockOutlined /></template>
                </a-button>
            </a-tooltip>
            <inline-editor
                :value="item.layerName"
                @change="handleChange('layerName', $event, true, item.id)"
            ></inline-editor>
        </li>
    </ul>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
import { ComponentDataType } from '../../store/interface/editor'
import InlineEditor from '../InlineEditor/index.vue'
import { arrayMoveImmutable } from 'array-move'
import { EyeOutlined, EyeInvisibleOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons-vue'
import { getDragTargetIndex } from '../../utils'
import useEditorStore from '../../store/editor'
const editorStore = useEditorStore()
const props = defineProps<{ list: ComponentDataType[]; currentSelectId: string }>()
const dragData = reactive({
    currentDraggingId: '',
    currentDraggingIndex: -1,
})
const handleDragStart = (id: string, index: number) => {
    dragData.currentDraggingId = id
    dragData.currentDraggingIndex = index
}
const handleEnter = (e: DragEvent) => {
    const currentEle = getDragTargetIndex(e.target as HTMLElement, 'ant-list-item') as HTMLElement
    if (currentEle.dataset.index) {
        const moveIndex = Number(currentEle.dataset.index)
        if (moveIndex !== dragData.currentDraggingIndex) {
            const arr = arrayMoveImmutable(props.list, dragData.currentDraggingIndex, moveIndex)
            dragData.currentDraggingIndex = moveIndex
            editorStore.$patch({
                components: arr,
            })
        }
    }
}
const handleDrop = () => {
    dragData.currentDraggingId = ''
}
const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
}
const emits = defineEmits(['change', 'select'])
const handleChange = (key: string, value: boolean, isRoot?: boolean, id?: string) => {
    console.log(key, value)
    // currentSelectId.value = id
    emits('change', { key, value, isRoot, id })
}
const handleSelect = (id: string) => {
    // currentSelectId.value = id
    emits('select', id)
}
</script>
<style scoped lang="scss">
.ant-list-item {
    padding: 10px 15px;
    transition: all 0.5s ease-out;
    cursor: pointer;
    justify-content: normal;
    border: 1px solid #fff;
    border-bottom-color: #f0f0f0;
}
.ant-list-item.active {
    border: 1px solid #1890ff;
}
.ant-list-item.ghost {
    opacity: 0.5;
}

.ant-list-item:hover {
    background: #e6f7ff;
}
.ant-list-item > * {
    margin-right: 10px;
}
.ant-list-item button {
    font-size: 12px;
}

.ant-list-item .handle {
    cursor: move;
    margin-left: auto;
}
.ant-list-item .edit-area {
    width: 100%;
}
</style>
