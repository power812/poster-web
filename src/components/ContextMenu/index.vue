<template>
    <div class="context-menu-component menu-container" ref="menuRef">
        <ul class="ant-menu-light ant-menu-root ant-menu ant-menu-vertical">
            <li
                v-for="(action, index) in actions"
                :key="index"
                @click="action.action(componentId)"
                class="ant-menu-item"
            >
                <span class="item-text">{{ action.text }}</span>
                <span class="item-shortcut">{{ action.shortcut }}</span>
            </li>
        </ul>
    </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { getParentElement } from '../../utils/index'

interface ActionItem {
    action: (cid?: string) => void
    text: string
    shortcut: string
}
defineProps<{ actions: ActionItem[]; triggerClass?: string }>()
const menuRef = ref<HTMLElement | null>(null)
const componentId = ref('')
const triggerContextMenu = (e: MouseEvent) => {
    const domElement = menuRef.value as HTMLElement
    const wrapperElement = getParentElement(e.target as HTMLElement, 'edit-wrapper')

    if (wrapperElement) {
        e.preventDefault()
        domElement.style.display = 'block'
        domElement.style.top = e.pageY + 'px'
        domElement.style.left = e.pageX + 'px'
        const cid = wrapperElement.dataset.componentId
        console.log(cid)
        if (cid) {
            componentId.value = cid
        }
    }
}
const handleClick = () => {
    const domElement = menuRef.value as HTMLElement
    domElement.style.display = 'none'
}
onMounted(() => {
    document.addEventListener('contextmenu', triggerContextMenu)
    document.addEventListener('click', handleClick)
})

onUnmounted(() => {
    console.log('removed')
    document.removeEventListener('contextmenu', triggerContextMenu)
    document.removeEventListener('click', handleClick)
})
</script>
<style scoped lang="scss">
.menu-container {
    display: none;
    position: absolute;
    background: #fff;
    z-index: 2000;
    width: 220px;
    border: 1px solid #ccc;
}
.menu-container .ant-menu-item {
    display: flex;
    justify-content: space-between;
}
.menu-container .ant-menu-item:hover {
    background: #efefef;
}
.ant-menu-item .item-shortcut {
    color: #ccc;
}
</style>
