<template>
    <div class="edit-groups">
        <a-collapse v-model:activeKey="activeKey">
            <a-collapse-panel v-for="(item, key) in editGroups" :key="`item-${key}`" :header="item.text">
                <select-table @change="handleChange" :data="item.propsMap"></select-table>
            </a-collapse-panel>
        </a-collapse>
    </div>
</template>
<script lang="ts"></script>
<script setup lang="ts">
import SelectTable from '../SelectTable/index.vue'
import { AllComponentProps } from 'lego-bricks'
import { computed, ref } from 'vue'
import { difference } from 'lodash-es'
import { defaultEditGroups } from './defaultEditGroup'
export interface GroupProps {
    text: string
    items: string[]
}
const activeKey = ref('item-0')
interface Props {
    data: Partial<AllComponentProps>
    groups?: GroupProps[]
}
const props = withDefaults(defineProps<Props>(), {
    groups: () => defaultEditGroups,
})

const newGroups = computed(() => {
    const allNormalGroup = props.groups.reduce((pre, curr) => {
        return [...pre, ...curr.items]
    }, [] as string[])
    const specialProps = difference(Object.keys(props.data), allNormalGroup)
    return [
        {
            text: '基本属性',
            items: specialProps,
        },
        ...props.groups,
    ]
})
const editGroups = computed(() => {
    return newGroups.value.map((group) => {
        const propsMap = {} as any
        group.items.forEach((key) => {
            if (Object.keys(props.data).length > 0) {
                propsMap[key] = props.data[key as keyof Partial<AllComponentProps>]
            }
        })
        // group.propsMap = propsMap
        return {
            ...group,
            propsMap,
        }
    })
})
const emits = defineEmits(['change'])
const handleChange = ({ key, value }: any) => {
    console.log({ key, value })
    emits('change', { key, value })
}
</script>
