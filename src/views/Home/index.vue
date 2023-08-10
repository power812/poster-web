<template>
    <div class="content-container">
        <a-row :gutter="16">
            <template-list :list="templateData"></template-list>
        </a-row>
        <a-row type="flex" justify="center"></a-row>
    </div>
</template>
<script setup lang="ts">
import { useTemplateStore } from './../../store/work'
import { useUserStore } from '../../store/user'
import TemplateList from '../../components/TemplateList/index.vue'
import { computed, onMounted } from 'vue'
import axios from 'axios'
import { isEmptyObject } from '../../utils/index'
const templateStore = useTemplateStore()
const userStore = useUserStore()
const templateData = computed(() => templateStore.templateData || [])
onMounted(async () => {
    await templateStore.fetchTemplate()
    if (userStore.token && isEmptyObject(userStore.userInfo)) {
        try {
            axios.defaults.headers.common.Authorization = `Bearer ${userStore.token}`
            const userInfo = await userStore.fetchCurrentUser()
            userStore.userInfo = userInfo
        } catch (e) {
            localStorage.removeItem('token')
            delete axios.defaults.headers.common.Authorization
        }
    }
})
</script>
../../store/work
