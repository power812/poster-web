<template>
    <div class="publish-channel-container">
        <a-row :style="{ marginBottom: '20px' }">
            <a-col :span="8" class="left-col">
                封面图
                <img :src="page.coverImg" :alt="page.title" />
            </a-col>
            <a-col :span="16" class="right-col">
                <a-row>
                    <a-col :span="6">
                        <img
                            src="http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5f79389d4737571e2e1dc7cb.png"
                            :alt="page.title"
                        />
                    </a-col>
                    <a-col :span="18" class="left-gap">
                        <h4>{{ page.title }}</h4>
                        <p>{{ page.desc }}</p>
                    </a-col>
                </a-row>
                <a-tabs type="card" :style="{ marginTop: '20px' }">
                    <a-tab-pane key="channels" tab="发布为作品">
                        <a-row v-for="channel in channels" :key="channel.id" class="channel-item">
                            <a-col :span="6">
                                <canvas class="barcode-container" :id="`channel-barcode-${channel.id}`" />
                            </a-col>
                            <a-col :span="18" class="left-gap">
                                <h4>{{ channel.name }}</h4>
                                <a-row>
                                    <a-col :span="18">
                                        <a-input
                                            :value="generateChannelURL(channel.workId, channel.id)"
                                            :readonly="true"
                                            :id="`channel-url-${channel.id}`"
                                        />
                                    </a-col>
                                    <a-col :span="6">
                                        <a-button
                                            class="copy-button"
                                            :data-clipboard-target="`#channel-url-${channel.id}`"
                                        >
                                            复制
                                        </a-button>
                                    </a-col>
                                </a-row>
                            </a-col>
                            <div class="delete-area">
                                <a-button
                                    type="danger"
                                    size="small"
                                    @click="deleteChannel(channel.id)"
                                    :disabled="deleteDisabled"
                                >
                                    删除渠道
                                </a-button>
                            </div>
                        </a-row>
                        <a-form layout="inline" :style="{ marginTop: '20px' }" :model="form" :rules="rules">
                            <a-form-item name="channelName">
                                <a-input placeholder="渠道名称" v-model:value="form.channelName"></a-input>
                            </a-form-item>
                            <a-form-item>
                                <a-button type="primary" @click="createChannel">创建新渠道</a-button>
                            </a-form-item>
                        </a-form>
                    </a-tab-pane>
                    <a-tab-pane key="template" tab="发布为模版"></a-tab-pane>
                </a-tabs>
            </a-col>
        </a-row>
    </div>
</template>
<script setup lang="ts">
import { editorStoreType } from './../../store/editor'
import useEditorStore from '../../store/editor'
import { computed, reactive, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Form, message } from 'ant-design-vue'
import QRCode from 'qrcode'
import ClipboardJS from 'clipboard'
const currentWorkId = useRoute().params.id
const editorStore = useEditorStore()
const channels = computed(() => editorStore.channels)
const deleteDisabled = computed(() => channels.value.length === 1)
defineProps<{ page: editorStoreType['pageData'] }>()
const form = reactive({
    channelName: '',
})
// 二维码
const generateQrcode = async () => {
    channels.value.map(async (channel) => {
        const ele = document.getElementById(`channel-barcode-${channel.id}`)
        await QRCode.toCanvas(ele, generateChannelURL(channel.workId, channel.id), { width: 100 })
    })
}
onMounted(async () => {
    generateQrcode()
    // 初始化复制
    // 复制
    const clipboard = new ClipboardJS('.copy-button')
    clipboard.on('success', (e) => {
        message.success('复制成功')
        // 清楚选项
        e.clearSelection()
    })
})
watch(
    channels,
    () => {
        generateQrcode()

        // console.log(newChannels, oldChannels)
    },
    {
        flush: 'post',
    },
)

const rules = reactive({
    channelName: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
})

const { validate } = Form.useForm(form, rules)
const createChannel = async () => {
    try {
        await validate()
        await editorStore.createChannel(currentWorkId, form.channelName)
        await editorStore.fetchChannel(currentWorkId)
        form.channelName = ''
    } catch (e) {
        console.error(e)
    }
}
const generateChannelURL = (workId: number, id: string) => {
    const h5baseUrl = 'http://localhost:7001/api/utils/pages'
    return `${h5baseUrl}/p/${workId}-${id}`
}
const deleteChannel = async (id: string) => {
    await editorStore.deleteChannel(id)
    await editorStore.fetchChannel(currentWorkId)
}
</script>
<style lang="scss" scoped>
.left-col img {
    width: 80%;
}
.right-col img {
    width: 80px;
}
.left-gap {
    padding-left: 5px;
    height: 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.delete-area {
    position: absolute;
    top: 10px;
    right: 20px;
}
.channel-item {
    padding: 10px 0;
    border-bottom: 1px solid #efefef;
    position: relative;
}
.barcode-container {
    height: 80px;
    width: 80px;
}
.template-submit {
    margin-top: 20px;
    display: flex;
    justify-content: center;
}
</style>
