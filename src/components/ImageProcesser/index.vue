<template>
    <div>
        <div class="image-processer">
            <div class="image-process">
                <img :src="value" id="processed-image" />
                <a-button @click="showModal = true">
                    <template #:icon><ScissorOutlined /></template>
                    裁剪图片
                </a-button>
                <a-button v-if="showDelete" type="danger" @click="handleDelete">
                    <template #:icon><DeleteOutlined /></template>
                    删除图片
                </a-button>
            </div>
        </div>
        <a-modal
            title="裁剪图片"
            v-model:visible="showModal"
            @ok="handleOk"
            @cancel="showModal = false"
            okText="确认"
            cancelText="取消"
        >
            <div class="image-cropper">
                <img :src="baseUrl" id="processed-image" ref="cropperImg" />
            </div>
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { DeleteOutlined, ScissorOutlined } from '@ant-design/icons-vue'
import Cropper from 'cropperjs'
import { nextTick, ref, watch, computed } from 'vue'
defineOptions({
    name: 'ImageProcesser',
})
const props = defineProps<{ value: string }>()
const showModal = ref(false)
const showDelete = ref(true)

const emits = defineEmits(['change'])
const handleDelete = () => {
    console.log('delete')
}

// 裁剪图片
interface cropperDataType {
    x: number
    y: number
    width: number
    height: number
}
let cropperData: null | cropperDataType = null
const baseUrl = computed(() => props.value.split('?')[0])
const handleOk = () => {
    showModal.value = false
    if (cropperData) {
        const srcUrl = `${baseUrl.value}?x-oss-process=image/crop,x_${cropperData.x},y_${cropperData.y},w_${cropperData.width},h_${cropperData.height}`
        emits('change', srcUrl)
    }
}

const cropperImg = ref<null | HTMLImageElement>(null)
let cropper: Cropper
watch(showModal, async (newValue) => {
    if (newValue) {
        // todo
        await nextTick()
        if (cropperImg.value) {
            cropper = new Cropper(cropperImg.value, {
                aspectRatio: 16 / 9,
                crop(event) {
                    const { x, y, width, height } = event.detail
                    cropperData = {
                        x: Math.floor(x),
                        y: Math.floor(y),
                        width: Math.floor(width),
                        height: Math.floor(height),
                    }
                    // console.log(event.detail.x)
                    // console.log(event.detail.y)
                    // console.log(event.detail.width)
                    // console.log(event.detail.height)
                    // console.log(event.detail.rotate)
                    // console.log(event.detail.scaleX)
                    // console.log(event.detail.scaleY)
                },
            })
            console.log(cropper)
        }
    } else {
        if (cropper) {
            cropper.destroy()
        }
    }
})
</script>
<style scoped lang="scss">
.image-cropper img {
    display: block;
    /* This rule is very important, please don't ignore this */
    max-width: 100%;
}
#processed-image {
    width: 200px;
}
</style>
