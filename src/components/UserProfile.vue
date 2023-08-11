<template>
    <router-link :to="`${prefix}login`" v-if="isEmptyObject(userStore.userInfo)">
        <a-button type="primary" class="user-profile-component">登录</a-button>
    </router-link>
    <div v-else>
        <a-dropdown-button class="user-profile-component">
            <router-link to="/">{{ userInfo.nickname }}</router-link>
            <template #overlay>
                <a-menu class="user-profile-dropdown">
                    <a-menu-item key="0">登出</a-menu-item>
                </a-menu>
            </template>
        </a-dropdown-button>
    </div>
</template>
<script setup lang="ts">
import { useUserStore } from '../store/user'
import { computed } from 'vue'
import { isEmptyObject } from '../utils'
import { getCurrentInstance } from 'vue'
const prefix = getCurrentInstance()?.appContext.config.globalProperties.$prefix
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
console.log(userInfo)
</script>
<style scoped lang="scss">
.user-profile-component {
    border-radius: 20px;
}

.user-operation {
    margin-left: 30px;
}
</style>
