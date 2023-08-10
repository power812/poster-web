<template>
    <context-menu :actions="testAcitons"></context-menu>
    <header-bar @publish="publish" :publishLoading="publishLoading"></header-bar>
    <a-layout>
        <a-layout>
            <a-layout-sider>
                <h2>组件列表</h2>
                <div class="canvas-area">
                    <ComponentList :list="defaultTextTemplates" @itemClick="handleAddItem"></ComponentList>
                </div>
            </a-layout-sider>
            <a-layout-content class="main">
                <div>画布区域</div>
                <history-area></history-area>
                <div id="canvas-area" class="canvas-area" :style="editStore.pageData.props">
                    <edit-wrapper
                        :class="{ 'canvas-fix': canvasFix }"
                        @sendItemData="handleSendItemData"
                        v-for="component in editStore.components"
                        :key="component.id"
                        :id="component.id"
                        :props="component.props"
                        :isHidden="component.isHidden || false"
                        @update-position="updatePositon"
                    >
                        <component :is="component.name" v-bind="component.props" />
                    </edit-wrapper>
                </div>
            </a-layout-content>
            <a-layout-sider width="300px">
                <a-tabs v-model:activeKey="activePanel">
                    <a-tab-pane key="component" tab="属性设置">
                        <edit-group
                            v-if="!editStore.currentElement?.isLocked"
                            :data="editStore.currentElement?.props || {}"
                            @change="handleChange"
                        ></edit-group>
                        <a-empty v-else>
                            <template #description>
                                <p>该元素被锁定，无法编辑</p>
                            </template>
                        </a-empty>
                    </a-tab-pane>
                    <a-tab-pane key="layer" tab="图层设置" force-render>
                        <layer-list
                            @select="handleSendItemData"
                            @change="handleChange"
                            :currentSelectId="editStore.currentElement?.id || ''"
                            :list="editStore.components"
                        ></layer-list>
                    </a-tab-pane>
                    <a-tab-pane tab="页面设置">
                        <select-table @change="handleChangeBackground" :data="editStore.pageData.props"></select-table>
                    </a-tab-pane>
                </a-tabs>

                <pre>{{ editStore.pageData.props }}</pre>
            </a-layout-sider>
        </a-layout>
    </a-layout>
    <a-modal title="发布成功" v-model:visible="showPublishForm" width="700px" :footer="null">
        <publish-form :page="editStore.pageData" />
    </a-modal>
</template>
<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import useEditorStore from './../../store/editor.ts'
import defaultTextTemplates from './data/defaultTemplate.ts'
import ComponentList from '../../components/ComponentList/index.vue'
import HistoryArea from './historyArea.vue'

// import SelectTable from '../../components/selectTable/index.vue'
import EditGroup from '../../components/EditGroup/index.vue'
// import BackgroundProcesser from '../../components/BackgroundProcesser/index.vue'
import LayerList from '../../components/LayerList/index.vue'
import HeaderBar from '../../components/HeaderBar/index.vue'
import EditWrapper from '../../components/EditWrapper/index.vue'
import initHotKey from '../../plugins/hotKey'
import { useRoute, onBeforeRouteLeave } from 'vue-router'
import { Modal } from 'ant-design-vue'
import { takeScreenshotAndUpload } from '../../utils/index'
import { paramType } from './../../store/editor.ts'
import PublishForm from './publishForm.vue'
const publishLoading = ref(false)
const showPublishForm = ref(false)

const editStore = useEditorStore()
const route = useRoute()
const { id } = route.params

onMounted(() => {
    editStore.fetchWork(id)
})
const testAcitons = [
    {
        text: '测试右键',
        shortcut: 'fjsojoj',
    },
]
// 注册快捷键
initHotKey()
const activePanel = ref('component')

// 改变组件属性

const handleChangeBackground = (data: paramType) => {
    editStore.updatePageData(data)
}
const handleChange = (data: paramType) => {
    editStore.updateComponentData(data)
}
//  添加组件
const handleAddItem = (item: any) => {
    editStore.addItem(item)
}
// 添加属性
const handleSendItemData = (id: string) => {
    editStore.currentSelect(id)
}
// 更新组件left top值
interface positionType {
    left: number
    top: number
    width: number
    height: number
    id: string
}
const updatePositon = ({ left, top, id, width, height }: positionType) => {
    if (left) {
        editStore.updateComponentData({ key: 'left', value: left, id })
    }
    if (top) {
        editStore.updateComponentData({ key: 'top', value: top, id })
    }

    if (width) {
        editStore.updateComponentData({ key: 'width', value: width, id })
    }
    if (height) {
        editStore.updateComponentData({ key: 'height', value: height, id })
    }
}
// 离开保存
onBeforeRouteLeave((_to, _from, next) => {
    if (!editStore.isDirty) return next()
    Modal.confirm({
        title: '作品还没保存，是否保存',
        okText: '保存',
        okType: 'primary',
        cancelText: '不保存',
        onOk: async () => {
            await editStore.saveWork(id)
            next()
        },
        onCancel: () => {
            next()
        },
    })
})
// 发布
const canvasFix = ref(false)
const publish = async () => {
    const canvasArea = document.getElementById('canvas-area')
    if (canvasArea) {
        // useCORS 解决跨域， scale默认为像素比
        canvasFix.value = true
        publishLoading.value = true
        await nextTick()
        try {
            const resp = await takeScreenshotAndUpload(canvasArea)

            if (resp) {
                editStore.updatePageData({ key: 'coverImg', value: resp.url, isRoot: true })
                await editStore.saveWork(id)
                await editStore.publishWork(id)
                const channel = await editStore.fetchChannel(id)
                if (!channel.length) {
                    await editStore.createChannel(id)
                }
                showPublishForm.value = true
            }
        } catch (e) {
            console.error(e)
        } finally {
            canvasFix.value = false
            publishLoading.value = false
        }
    }
}

window.onbeforeunload = () => {}
</script>
<style scoped lang="scss">
:deep(.ant-layout-sider-children) {
    background: #fff;
}
.edit-wrapper .l-image-component,
.edit-wrapper .l-shape-component,
.edit-wrapper .l-text-component {
    position: static !important;
}

.main {
    position: relative;
}
.canvas-area {
    position: relative;
    width: 375px;
}

.editor-container .preview-container {
    padding: 24px;
    margin: 0;
    min-height: 85vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
}

.editor-container .preview-list {
    padding: 0;
    margin: 0;
    min-width: 375px;
    min-height: 200px;
    border: 1px solid #efefef;
    background: #fff;
    overflow-x: hidden;
    overflow-y: auto;
    position: fixed;
    margin-top: 50px;
    max-height: 80vh;
}

.page-title {
    display: flex;
}

.page-title .inline-edit span {
    font-weight: 500;
    margin-left: 10px;
    font-size: 16px;
}

.preview-list.canvas-fix .edit-wrapper > * {
    box-shadow: none !important;
}

.preview-list.canvas-fix {
    position: absolute;
    max-height: none;
}

.layout-col {
    height: 100%;
}
.active {
    border: 1px solid #1890ff;
}
</style>
