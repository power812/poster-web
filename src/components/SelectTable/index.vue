<template>
    <div class="select-table" v-for="(val, key) in finalData" :key="key">
        <div v-if="val.text" class="label">{{ val.text }}</div>
        <component
            v-if="val"
            v-model:value="val.value"
            class="select-com"
            v-on:[val.eventName]="handleEmit(val.key, val.value, $event)"
            :is="val.componentName"
            v-bind="val.extraAntAttr"
        >
            <template v-if="val.options">
                <component
                    :is="val?.subComponentName"
                    v-for="(option, k) in val.options"
                    :value="option.value"
                    :key="k"
                >
                    {{ option.text }}
                </component>
            </template>
        </component>
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
// import { TextComponentTypeProps } from '../defaultAttr/index'
import { finalDataType } from './interface/index'
import { mapPropsToForms, PropsToForms } from './../propsMap'
import { AllComponentProps } from 'lego-bricks'
const props = defineProps<{ data: Partial<AllComponentProps> }>()

// const componentsMap: componentsMapType = {
//     text: {
//         componentName: 'a-textarea',
//         text: '文字',
//         extraAntAttr: { row: 3 },
//         subComponentName: '',
//     },
//     fontSize: {
//         componentName: 'a-input-number',
//         text: '字号',
//         subComponentName: '',
//         transformDataType(v: any) {
//             return parseInt(v)
//         },
//         afterTransformDataType(v: any) {
//             return `${v ? v : 0}px`
//         },
//     },
//     color: {
//         componentName: 'color-picker',
//         subComponentName: '',
//         extraAntAttr: {},
//         text: '字体颜色',
//     },
//     lineHeight: {
//         componentName: 'a-slider',
//         subComponentName: '',
//         extraAntAttr: { max: 10, min: 0, step: 0.2 },
//         text: '行高',
//         transformDataType(v: string) {
//             return parseFloat(v)
//         },
//         afterTransformDataType(v: any) {
//             return String(v)
//         },
//     },
//     textAlign: {
//         componentName: 'a-radio-group',
//         text: '对齐',
//         subComponentName: 'a-radio-button',
//         options: [
//             {
//                 value: 'left',
//                 text: '左',
//             },
//             {
//                 value: 'center',
//                 text: '中',
//             },
//             {
//                 value: 'right',
//                 text: '右',
//             },
//         ],
//     },
//     fontFamily: {
//         componentName: 'a-select',
//         subComponentName: 'a-select-option',
//         text: '字体',
//         value: '',
//         options: [
//             { text: '无', value: '""' },
//             { text: '宋体', value: '"SimSun","STSong"' },
//             { text: '黑体', value: '"SimHei","STHeiti"' },
//             { text: '楷体', value: '"KaiTi","STKaiti"' },
//             { text: '仿宋', value: '"FangSong","STFangsong"' },
//         ],
//     },
//     src: {
//         componentName: 'image-processer',
//         subComponentName: '',
//         text: '图片',
//         value: '',
//         extraAntAttr: {},
//         options: [],
//     },
// }
const finalData = computed(() => {
    let result = {} as finalDataType
    Object.keys(props.data).map((key) => {
        const newKey = key as keyof AllComponentProps
        const item = props.data[newKey]
        const itemMap = mapPropsToForms[newKey]
        if (itemMap) {
            result[newKey] = {
                value: itemMap.initalTransform ? itemMap.initalTransform(item) : item,
                componentName: itemMap.component || '',
                subComponentName: itemMap.subComponent || '',
                text: itemMap.text,
                options: itemMap.options,
                extraAntAttr: itemMap.extraProps,
                eventName: itemMap.eventName ? itemMap.eventName : 'change',
                key: newKey as string,
            }
        }
    })

    return result
})

const emit = defineEmits<{
    (e: 'change', data: { key: string; value: string }): void
}>()
const handleEmit = (key: string, v: string, arg: string) => {
    const afterTransform = mapPropsToForms[key as keyof PropsToForms]?.afterTransform
    let value = arg || v
    if (afterTransform) {
        value = afterTransform(value)
    }
    console.log(value)
    // todo
    // if (typeof value === 'object') {
    //     const transform = componentsMap[key as keyof TextComponentTypeProps]?.afterTransformDataType
    //     v = value.target.value
    //     if (transform) {
    //         v = transform(parseInt(v)) || v
    //     }
    // } else {
    //     switch (key) {
    //         case 'fontFamily':
    //             break
    //         case 'lineHeight':
    //             break
    //         default:
    //             v = `${v}px`
    //     }
    // }
    // v = parseInt(v)
    emit('change', { key, value })
}
</script>
<style scoped lang="scss">
.select-table {
    display: flex;
    margin-bottom: 10px;
    flex: 1;

    .select-com {
        flex: 1;
    }

    .label {
        width: 80px;
    }
}
</style>
../propsMap
