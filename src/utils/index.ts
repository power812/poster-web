import { mapValues, pick } from 'lodash-es'
import { computed } from 'vue'
import { TextComponentTypeProps } from '../components/defaultAttr'
import html2canvas from 'html2canvas'
import axios from 'axios'
export const transformToComponentProps = <T extends {}>(props: T) => {
    return mapValues(props, (item) => {
        return {
            type: (item as any).constructor as StringConstructor,
            default: item,
        }
    })
}
export const useComponentCommon = (props: Readonly<Partial<TextComponentTypeProps>>, picks: string[]) => {
    const styleProps = computed(() => pick(props, picks))
    // const styleProps = () => pick(props, picks)
    // const handleClick = () => {
    //     if (props.actionType === 'url' && props.url) {
    //         window.location.href = props.url
    //     }
    // }
    return {
        styleProps,
        // handleClick,
    }
}
export const isEmptyObject = (object: Object) => {
    return Object.keys(object).length === 0
}
export const getDragTargetIndex = (element: HTMLElement, className: string) => {
    while (element) {
        if (element.classList.contains(className)) {
            return element
        } else {
            element = element.parentNode as HTMLElement
        }
    }
    return null
}
export const getParentElement = (element: HTMLElement, className: string) => {
    while (element) {
        if (element.classList && element.classList.contains(className)) {
            return element
        } else {
            element = element.parentNode as HTMLElement
        }
    }
    return null
}
export const uploadFile = async (file: Blob, url = '/utils/uploadImageBlob', filename = 'screenshot.jpg') => {
    const newFile = file instanceof File ? file : new File([file], filename)
    console.log(newFile)
    const formData = new FormData()
    formData.append(newFile.name, newFile)
    const { data } = await axios.post(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    return data
}

export const takeScreenshotAndUpload = async (ele: HTMLElement) => {
    const canvas = await html2canvas(ele, { width: 375, scale: 1, useCORS: true })
    // 获取截图二进制图片
    const blobPromeis: Promise<Blob | null> = new Promise((reslove) => {
        canvas.toBlob((blob) => {
            reslove(blob)
        })
    })
    const blobImage = await blobPromeis
    if (blobImage) {
        // 上传图片
        const data = await uploadFile(blobImage)
        return data
    }
}
