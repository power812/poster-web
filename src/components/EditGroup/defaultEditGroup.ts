import { GroupProps } from './index.vue'
export const defaultEditGroups: GroupProps[] = [
    {
        text: '尺寸',
        items: ['height', 'width', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom'],
    },
    {
        text: '边框',
        items: ['borderStyle', 'borderColor', 'borderWidth', 'borderRadius'],
    },
    {
        text: '阴影与透明度',
        items: ['opacity', 'boxShadow'],
    },
    {
        text: '位置',
        items: ['left', 'top'],
    },
    {
        text: '事件功能',
        items: ['actionType', 'url'],
    },
]
