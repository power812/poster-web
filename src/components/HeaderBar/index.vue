<template>
    <a-layout-header class="header">
        <div class="page-title">
            <router-link to="/">
                <img alt="power设计" src="../../assets/logo.png" class="logo-img" />
                {{ editStore.pageData.title }}
            </router-link>
            <!-- <inline-edit :value="page.title" @change="titleChange" /> -->
        </div>
        <a-menu class="header-menu" :selectable="false" theme="dark" mode="horizontal" :style="{ lineHeight: '64px' }">
            <a-menu-item key="1">
                <a-button type="primary">预览和设置</a-button>
            </a-menu-item>
            <a-menu-item key="2">
                <a-button type="primary" @click="saveWork" :loading="loading">保存</a-button>
            </a-menu-item>
            <a-menu-item key="3">
                <a-button type="primary" @click="publish" :loading="publishLoading">发布</a-button>
            </a-menu-item>
            <a-menu-item key="4">
                <user-profile></user-profile>
            </a-menu-item>
        </a-menu>
    </a-layout-header>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import useEditorStore from '../../store/editor'

import { message } from 'ant-design-vue'
import { useRoute } from 'vue-router'
defineProps<{ publishLoading: boolean }>()
const editStore = useEditorStore()
const loading = ref(false)
const { id } = useRoute().params
const saveWork = async () => {
    loading.value = true
    await editStore.saveWork(id)
    message.success('保存成功', 1)
    loading.value = false
}
// 发布
const emits = defineEmits(['publish'])
const publish = () => {
    emits('publish')
}
// 自动保存
let timer: NodeJS.Timeout
onMounted(() => {
    timer = setInterval(async () => {
        if (editStore.isDirty) {
            loading.value = true
            await editStore.saveWork(id)
            setTimeout(() => {
                loading.value = false
            }, 2000)
        }
    }, 20000)
})
onUnmounted(() => {
    clearInterval(timer)
})
</script>
<style lang="scss" scoped>
.header-menu {
    width: 550px;
}
:deep(.ant-layout-sider-children) {
    background: #fff;
}

.header {
    display: flex;
    justify-content: space-between;
}
</style>
