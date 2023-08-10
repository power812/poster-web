<template>
    <a-layout>
        <a-layout-header class="header">
            <h2>
                <img class="logo" src="./../../assets/logo.png" alt="logo" />
                <router-link class="text" to="/">power设计</router-link>
            </h2>
            <user-profile></user-profile>
        </a-layout-header>
        <a-layout-content>
            <router-view></router-view>
        </a-layout-content>
        <a-layout-footer>Footer</a-layout-footer>
    </a-layout>
</template>
<script setup lang="ts">
import UserProfile from './../../components/UserProfile.vue'
</script>
<style scoped lang="scss">
.header {
    display: flex;
    justify-content: space-between;

    .text {
        color: #fff;
        font-size: 16px;
        margin-left: 5px;
    }

    .logo {
        width: 35px;
        height: 35px;
    }
}
</style>
