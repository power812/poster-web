<template>
    <draggable :list="list" item-key="id" class="ant-list-items ant-list-bordered" ghost-class="ghost" handle=".handle">
        <template #item="{ element }">
            <li
                :class="{ ghost: dragData.currentDraggingId === element.id }"
                @click="handleSelect(element.id)"
                class="ant-list-item"
                draggable="true"
            >
                <a-tooltip :title="element.isHidden ? '显示' : '隐藏'">
                    <a-button
                        shape="circle"
                        @click.stop="handleChange('isHidden', !element.isHidden, true, element.id)"
                    >
                        <template #icon v-if="element.isHidden"><EyeOutlined /></template>
                        <template #icon v-else><EyeInvisibleOutlined /></template>
                    </a-button>
                </a-tooltip>
                <a-tooltip :title="element.isLocked ? '解锁' : '锁定'">
                    <a-button
                        shape="circle"
                        @click.stop="handleChange('isLocked', !element.isLocked, true, element.id)"
                    >
                        <template #icon v-if="element.isLocked"><UnlockOutlined /></template>
                        <template #icon v-else><LockOutlined /></template>
                    </a-button>
                </a-tooltip>
                <inline-editor
                    :value="element.layerName"
                    @change="handleChange('layerName', $event, true, element.id)"
                ></inline-editor>
                <a-tooltip title="拖动排序">
                    <a-button shape="circle" class="handle">
                        <template #icon>
                            <DragOutlined />
                        </template>
                    </a-button>
                </a-tooltip>
            </li>
        </template>
    </draggable>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
import { ComponentDataType } from '../../store/interface/editor'
import InlineEditor from '../InlineEditor/index.vue'
import draggable from 'vuedraggable'

import { EyeOutlined, EyeInvisibleOutlined, LockOutlined, UnlockOutlined, DragOutlined } from '@ant-design/icons-vue'
defineProps<{ list: ComponentDataType[]; currentSelectId: string }>()
const dragData = reactive({
    currentDraggingId: '',
    currentDraggingIndex: -1,
})

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
.ant-list-element.active {
    border: 1px solid #1890ff;
}
.ant-list-element.ghost {
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
