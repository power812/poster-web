import { defineStore } from 'pinia'
import { ComponentDataType } from './interface/editor'
import { TextComponentTypeProps } from '../components/defaultAttr/index'
import { AllComponentProps, imageDefaultProps, textDefaultProps } from 'lego-bricks'
import { v4 as uuidv4 } from 'uuid'
import { PageProps } from '../components/propsMap'
import { cloneDeep } from 'lodash-es'
import { message } from 'ant-design-vue'
import axios from 'axios'

export const testComponents: ComponentDataType[] = [
    {
        id: uuidv4(),
        name: 'l-text',
        layerName: '图层1',
        isLocked: false,
        isHidden: false,
        props: {
            ...textDefaultProps,
            text: 'hello113',
            width: '100px',
            height: '100px',
            backgroundColor: '#cccccc',
            fontSize: '10px',
            textAlign: 'center',
            fontFamily: '"SimHei","STHeiti"',
            top: '10px',
            borderColor: '#000000',
            position: 'absolute',
            left: '10px',
        },
    },
    {
        id: uuidv4(),
        name: 'l-text',
        layerName: '图层2',
        isLocked: false,
        isHidden: false,
        props: {
            borderColor: '#000000',
            text: 'hello2sf',
            top: '30px',
            fontSize: '20px',
            lineHeight: '1',
            fontFamily: '"SimHei","STHeiti"',
        },
    },
    {
        id: uuidv4(),
        name: 'l-text',
        layerName: '图层3',
        isLocked: false,
        isHidden: false,
        props: {
            text: 'hello3',
            color: 'red',
            fontSize: '30px',
            top: '50px',
            fontFamily: '',
            actionType: 'url',
            borderColor: '#000000',
            // url: 'https://www.baidu.com',
        },
    },
    {
        id: uuidv4(),
        name: 'l-image',
        layerName: '图层4',
        isLocked: false,
        isHidden: false,
        props: {
            ...imageDefaultProps,
            src: '/src/assets/mei.jpg',
            width: '134px',
            top: '100px',
            borderColor: '#000000',
        },
    },
]
interface HistoryProps {
    id: string
    componentId: string
    type: 'add' | 'delete' | 'modify'
    data: any
    index?: number
}
export interface ChannelProps {
    id: string
    name: string
    workId: number
    //   status: number;
}
export interface editorStoreType {
    components: ComponentDataType[]
    currentElementId: string
    pageData: {
        title: string
        coverImg?: string
        props: PageProps
        desc?: string
    }
    copiedComponent: ComponentDataType
    // 回退操作
    histories: HistoryProps[]
    historyIndex: number
    // 是否修改
    isDirty: boolean
    channels: ChannelProps[]
}

export interface paramType {
    key: any
    value: any
    isRoot?: boolean
    id?: string
}
const pageDefaultProps = {
    backgroundColor: '#ffffff',
    backgroundImage: 'url("/src/assets/mei1.jpg")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    height: '750px',
}
type Direction = 'Up' | 'Down' | 'Left' | 'Right'
const useEditorStore = defineStore({
    id: 'editor',
    state: (): editorStoreType => {
        return {
            components: testComponents,
            currentElementId: testComponents[0].id,
            pageData: {
                title: '页面设置',
                desc: '',
                props: pageDefaultProps,
            },
            copiedComponent: {} as ComponentDataType,
            histories: [],
            historyIndex: -1,
            isDirty: false,
            channels: [],
        }
    },
    getters: {
        currentElement(state) {
            const current = state.components.find((component) => component.id === state.currentElementId)
            return current
        },
    },
    actions: {
        async deleteChannel(channelId: string) {
            const deleteData = axios.post(`/work/deleteWorkchannel/${channelId}`)
            console.log('deleteData', deleteData)
            return deleteData
        },
        async fetchChannel(id: string | string[]) {
            const data = await axios.get(`/work/getChannels/${id}`)
            console.log('channel', data)
            this.channels = data.data.list
            return this.channels || []
        },
        async createChannel(id: string | string[], channelName = '默认') {
            const payload = {
                name: channelName,
                workId: Number(id),
            }
            const data = await axios.post('/work/createChannel', payload)
            console.log('createChanel', data)
        },
        async publishWork(id: string | string[]) {
            const data = await axios.post(`/work/publishWork/${id}`)
            console.log('publish Data', data)
        },
        async saveWork(id: string | string[]) {
            await this.updateWork(id)
            this.isDirty = false
        },
        async updateWork(id: string | string[]) {
            // const title = this.title
            const payload = {
                title: 'hello',
                coverImg: this.pageData.coverImg,
                content: {
                    components: this.components,
                    props: this.pageData.props,
                },
            }
            const res = await axios.post(`/work/updateWork/${id}`, payload)
            console.log(res)
        },
        async fetchWork(id: string | string[]) {
            const res = await axios.get(`/work/${id}`)
            if (res.data) {
                this.components = res.data.content.components
                this.pageData.props = res.data.content.props
            }
            console.log(this.components)
        },
        // 撤销操作
        undo() {
            if (this.historyIndex === -1) {
                this.historyIndex = this.histories.length - 1
            } else {
                this.historyIndex--
            }
            const history = this.histories[this.historyIndex]
            switch (history.type) {
                case 'add':
                    this.components = this.components.filter((component) => component.id !== history.componentId)
                    break
                case 'delete':
                    this.components.splice(history.index as number, 1, history.data)
                    break
                case 'modify': {
                    const { componentId, data } = history
                    const { key, oldValue } = data
                    const updateComponent = this.components.find((component) => component.id === componentId)
                    if (updateComponent) {
                        updateComponent.props[key as keyof AllComponentProps] = oldValue
                    }
                    break
                }
                default:
                    break
            }
        },
        moveComponent(direction: Direction, amount: number) {
            this.isDirty = true
            if ((direction === 'Up' || direction === 'Down') && this.currentElement) {
                const top = parseFloat(this.currentElement.props.top || '0') + amount
                this.updateComponentData({
                    key: 'top',
                    value: top + 'px',
                })
            }
            if ((direction === 'Left' || direction === 'Right') && this.currentElement) {
                const left = parseFloat(this.currentElement.props.left || '0') + amount
                console.log(left)
                this.updateComponentData({
                    key: 'left',
                    value: left + 'px',
                })
            }
        },
        deleteComponent() {
            this.isDirty = true
            if (this.currentElementId) {
                this.components = this.components.filter((component) => component.id !== this.currentElementId)
                message.success('删除图层成功', 1)
                // 历史
                const currentIndex = this.components.findIndex((component) => component.id === this.currentElementId)
                this.histories.push({
                    id: uuidv4(),
                    componentId: this.currentElementId,
                    data: this.currentElement,
                    type: 'delete',
                    index: currentIndex,
                })
            }
        },
        copyComponent() {
            this.isDirty = true
            if (this.currentElement) {
                this.copiedComponent = this.currentElement
            }
        },
        pasteComponent() {
            this.isDirty = true
            const cloneComponent = cloneDeep(this.copiedComponent)
            cloneComponent.id = uuidv4()
            cloneComponent.layerName = cloneComponent.layerName + '副本'
            this.components.push(cloneComponent)
            // 历史
            this.histories.push({
                id: uuidv4(),
                componentId: cloneComponent.id,
                data: cloneComponent,
                type: 'add',
            })
        },
        // 添加组件
        addItem(props: Partial<TextComponentTypeProps>) {
            this.isDirty = true
            const item = {
                id: uuidv4(),
                name: 'l-text',
                props,
                layerName: '图层' + (this.components.length + 1),
                isLocked: false,
                isHidden: false,
            }
            this.components.push(item)
            // 历史
            this.histories.push({
                id: uuidv4(),
                componentId: item.id,
                data: item,
                type: 'add',
            })
        },
        // 选中
        currentSelect(id: string) {
            this.currentElementId = id
        },
        updatePageData({ key, value, isRoot }: paramType) {
            this.isDirty = true
            if (isRoot) {
                ;(this.pageData as any)[key] = value
            } else {
                this.pageData.props[key as keyof PageProps] = value
            }
        },
        updateComponentData({ key, value, isRoot, id }: paramType) {
            this.isDirty = true
            const current = this.components.find((component) => component.id === (id || this.currentElementId))
            if (current) {
                this.currentElementId = id || this.currentElementId
                if (isRoot) {
                    ;(current as any)[key] = value
                } else {
                    const oldValue = current.props[key as keyof AllComponentProps]
                    current.props[key as keyof AllComponentProps] = value
                    this.histories.push({
                        id: uuidv4(),
                        componentId: id || this.currentElementId,
                        type: 'modify',
                        data: { oldValue, newValue: value, key },
                    })
                }
            }
        },
    },
})
export default useEditorStore
