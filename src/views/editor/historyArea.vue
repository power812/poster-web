<template>
    <div class="history-area">
        <div class="operation-list">
            <a-tooltip>
                <template #title>撤销</template>
                <a-button shape="circle" @click="undoHistory">
                    <template #icon><UndoOutlined /></template>
                </a-button>
            </a-tooltip>
            <a-tooltip>
                <template #title>重做</template>
                <a-button shape="circle">
                    <template #icon><RedoOutlined /></template>
                </a-button>
            </a-tooltip>
        </div>
        <!-- <li v-for="(item, index) in histories" :key="item.id">
            <span :class="{ bold: index === historyIndex }">{{ item.type }} - {{ item.data.key }}</span>
        </li> -->
        <!-- <div>{{ editorStore.histories }}</div> -->
    </div>
</template>
<script setup lang="ts">
import useEditorStore from '../../store/editor'
import { RedoOutlined, UndoOutlined } from '@ant-design/icons-vue'
const editorStore = useEditorStore()
const undoHistory = () => {
    editorStore.undo()
}
</script>
