<template>
    <div class="background-processer">
        <upload actions="test.url" v-if="!value" :drag="true"></upload>
        <image-processer v-else :value="value"></image-processer>
    </div>
</template>
<script lang="ts" setup>
defineOptions({
    name: 'BackgroundProcesser',
})
const props = defineProps<{ value: string }>()
console.log(props)
</script>
