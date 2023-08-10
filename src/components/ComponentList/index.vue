<template>
    <div class="component-list" v-for="(val, index) in props.list" :key="index" @click="onItemClick(val)">
        <PText v-bind="val"></PText>
    </div>
</template>
<script setup lang="ts">
import { TextComponentTypeProps } from '../defaultAttr/index.ts'
import PText from '../PText/index.vue'

const props = defineProps<{ list: Partial<TextComponentTypeProps>[] }>()
const emit = defineEmits<{
    (e: 'itemClick', item: Partial<TextComponentTypeProps>): void
}>()
// 添加组件
const onItemClick = (item: Partial<TextComponentTypeProps>) => {
    emit('itemClick', item)
}
</script>
<style scoped lang="scss">
.component-list {
    margin-bottom: 10px;
}
</style>
