<template>
    <!-- <pre>{{ props }}</pre> -->
    <component :is="tag" class="p-text-component" :style="styleSheet" @click="handleClick">
        {{ props.text }}
    </component>
</template>
<script setup lang="ts">
import { StyleValue } from 'vue'
// import { pick, without } from 'lodash-es'
import { textDefaultProps, TextComponentTypeProps } from '../defaultAttr/index.ts'
// import { defaultProps } from 'ant-design-vue/es/vc-mentions/src/mentionsProps'
import { without, pick } from 'lodash-es'

// // import { transformToComponentProps } from '../../utils/index.ts'
function getStyleSheet(textData: Partial<TextComponentTypeProps>) {
    // 剔除样式属性
    const styleKey = without(Object.keys(textData), 'text', 'url', 'actionType')
    const styleSheet = pick(textData, styleKey)
    return styleSheet
}
// const defaultProps = transformToComponentProps(textDefaultProps)
const props = withDefaults(defineProps<Partial<TextComponentTypeProps>>(), textDefaultProps)
const styleSheet = getStyleSheet(props) as StyleValue
// console.log(styleSheet, '1', textDefaultProps)
// // const props = defineProps<{
//     text?: string
//     top?: string
//     fontSize?: string
//     url?: string
//     actionType?: string
//     color?: String
//     backgroundColor?: String
//     borderWidth?: String
//     borderColor?: String
//     borderStyle?: String
//     borderRadius?: String
//     paddingLeft?: String
//     paddingRight?: String
//     paddingTop?: String
//     paddingBottom?: String
//     width?: String
//     tag?: String
//     textAlign?: String
//     position?: String
//     fontWeight?: String
//     textDecoration?: String
// }>()

// const props = defineProps<ComponentDataPropsType>()

// const props = defineProps(defaultProps)
// console.log(props, 'ptext')
// const textData = Object.assign(textDefaultProps, props)

// 获取样式属性
// const styleSheet = reactive(getStyleSheet(textData)) as StyleValue
// const styleSheet = props as StyleValue
const handleClick = () => {
    if (props.actionType === 'url' && props.url) {
        window.location.href = props.url
    }
}
</script>
