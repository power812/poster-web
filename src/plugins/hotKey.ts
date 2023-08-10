import { message } from 'ant-design-vue'
import useHotKey from '../hooks/useHotKey'
import useEditorStore from '../store/editor'
// import { cloneDeep } from 'lodash-es'
// import { v4 as uuidv4 } from 'uuid'

const initHotKey = () => {
    const editorStore = useEditorStore()
    useHotKey('ctrl+c, command+c', () => {
        // const cloneComponent = cloneDeep(editorStore.currentElement)
        // cloneComponent.id = uuidv4()
        editorStore.copyComponent()
        message.success('复制成功')
    })
    useHotKey('ctrl+v, command+vs', () => {
        editorStore.pasteComponent()
        message.success('粘贴成功')
    })
    useHotKey('esc', () => {
        editorStore.$patch({
            currentElementId: '',
        })
    })
    useHotKey('backspace, delete', () => {
        editorStore.deleteComponent()
    })
    useHotKey('up', (e: KeyboardEvent) => {
        e.preventDefault()
        editorStore.moveComponent('Up', -1)
    })
    useHotKey('down', (e: KeyboardEvent) => {
        e.preventDefault()
        editorStore.moveComponent('Down', 1)
    })
    useHotKey('left', (e: KeyboardEvent) => {
        e.preventDefault()
        editorStore.moveComponent('Left', -1)
    })
    useHotKey('right', (e: KeyboardEvent) => {
        e.preventDefault()
        editorStore.moveComponent('Right', 1)
    })
}

export default initHotKey
