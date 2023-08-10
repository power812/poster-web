<template>
    <!-- <header-bar></header-bar> -->
    <router-view></router-view>
    <!-- <file-upload :before-upload="beforUpload" actions="/api/utils/upload-img" drag></file-upload> -->
    <!-- <button @click="login">gitee授权登录</button> -->
</template>
<script setup lang="ts">
// import { onMounted } from 'vue'
// import FileUpload from './components/Upload/index.vue'
// import axios from 'axios'
// const beforUpload = () => {
//     return true
// }
// onMounted(() => {
//     window.addEventListener('message', (m) => {
//         const token = m.data
//         axios
//             .get('http://127.0.0.1:7001/api/users/getUserInfo', {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             })
//             .then((data) => {
//                 console.log(data)
//             })
//         console.log(m)
//     })
// })
// const login = () => {
//     window.open('http://127.0.0.1:7001/api/users/gitee/oauth', '_blank')
// }
// import { useGlobalStore } from './store'
// const globalStore = useGlobalStore()
</script>
<style scoped lang="scss"></style>
