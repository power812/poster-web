import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { VueWrapper, flushPromises, mount, shallowMount } from '@vue/test-utils'
import Uploader from '../index.vue'
let wrapper: VueWrapper<any>
// const mockAxios = axios
const spy = vi.spyOn(axios, 'post')
const testFile = new File(['xyz'], 'test.png', { type: 'image/png' })
const setInputValue = (input: HTMLInputElement) => {
    const files = [testFile] as any
    Object.defineProperty(input, 'files', {
        value: files,
        writable: false,
    })
}
// const mockAxios = vi.mock('axios')
describe('upload.vue', () => {
    beforeAll(() => {
        wrapper = shallowMount(Uploader as any, {
            props: {
                actions: '/api/utils/upload-img',
                beforeUpload: () => true,
            },
        })
    })
    it('basic layout before upload', () => {
        expect(wrapper.find('button').exists()).toBeTruthy()
        expect(wrapper.get('button').text()).toBe('点击上传')
        expect(wrapper.get('input').isVisible()).toBeFalsy()
    })
    it('upload file process', async () => {
        spy.mockResolvedValueOnce({ data: { data: { code: '234' } } })
        spy.mockResolvedValueOnce({ data: { data: { token: '234' } } })
        spy.mockResolvedValueOnce({ data: { data: { token: '1234' } } })

        // spy.mockImplementationOnce(async () => 'jsofjd')
        // 添加fileList（上传文件）
        const fileInput = wrapper.get('input').element as HTMLInputElement
        setInputValue(fileInput)
        // 正在上传
        await wrapper.get('input').trigger('change')
        expect(spy).toHaveBeenCalledTimes(2) // ??
        expect(wrapper.get('button').text()).toBe('正在上传')
        expect(wrapper.get('button').attributes()).toHaveProperty('disabled')
        expect(wrapper.findAll('li').length).toBe(1)
        const firstItem = wrapper.get('li:first-child')
        expect(firstItem.classes()).toContain('upload-loading')
        // 上传成功
        await flushPromises()
        expect(spy).toHaveBeenCalledTimes(3)
        expect(wrapper.get('button').text()).toBe('点击上传')
        expect(firstItem.classes()).toContain('upload-success')
        expect(firstItem.get('.filename').text()).toBe(testFile.name)
    })
    it('upload Reject', async () => {
        spy.mockRejectedValueOnce({ error: 'error' })

        await wrapper.get('input').trigger('change')
        expect(wrapper.get('button').text()).toBe('正在上传')
        await flushPromises()
        expect(wrapper.get('button').text()).toBe('点击上传')
        // 待实现
        expect(wrapper.findAll('li').length).toBe(2)
        const lastItem = wrapper.get('li:last-child')
        expect(lastItem.classes()).toContain('upload-error')
        await lastItem.get('.delete-icon').trigger('click')

        expect(wrapper.findAll('li').length).toBe(1)
    })

    it('should show correct interface when running custom slot', async () => {
        spy.mockResolvedValueOnce({ data: { data: { code: '234' } } })
        spy.mockResolvedValueOnce({ data: { data: { token: '234' } } })
        spy.mockResolvedValueOnce({ data: { url: 'dumy.url' } })
        spy.mockResolvedValueOnce({ data: { data: { code: '234' } } })
        spy.mockResolvedValueOnce({ data: { data: { token: '234' } } })
        spy.mockResolvedValueOnce({ data: { url: 'power.url' } })
        const wrapper = mount(Uploader as any, {
            props: {
                actions: 'test.url',
                beforeUpload: () => true,
            },
            slots: {
                default: '<button>custom button</button>',
                loading: '<div class="loading"> custom loading</div>',
                uploaded: `<template v-slot="{ uploadedData }">
                    <div class="custom-loaded"> {{uploadedData.url}}</div>
                </template>`,
            },
        })
        expect(wrapper.get('button').text()).toBe('custom button')
        const fileInput = wrapper.get('input').element as HTMLInputElement
        setInputValue(fileInput)
        await wrapper.get('input').trigger('change')
        expect(wrapper.get('.loading').text()).toBe('custom loading')
        await flushPromises()
        expect(wrapper.get('.custom-loaded').text()).toBe('dumy.url')
        // 第二次发送
        await wrapper.get('input').trigger('change')
        expect(wrapper.get('.loading').text()).toBe('custom loading')
        await flushPromises()
        expect(wrapper.get('.custom-loaded').text()).toBe('power.url')
    })
    // 上传前的检查
    it('before upload', async () => {
        spy.mockResolvedValueOnce({ data: { data: { code: '234' } } })
        spy.mockResolvedValueOnce({ data: { data: { token: '234' } } })
        spy.mockResolvedValueOnce({ data: { url: 'dumy.url' } })
        const callback = vi.fn()
        const checkFileSize = (file: File) => {
            if (file.size > 2) {
                callback()
                return false
            }
            return true
        }
        const wrapper = shallowMount(Uploader as any, {
            props: {
                actions: 'test.url',
                beforeUpload: checkFileSize,
            },
        })
        const fileInput = wrapper.get('input').element as HTMLInputElement
        setInputValue(fileInput)
        await wrapper.get('input').trigger('change')
        // expect(spy).toHaveBeenCalled()
        expect(wrapper.findAll('li').length).toBe(0)
        expect(callback).toHaveBeenCalled()
    })
    it('before upload check using Promise', async () => {
        spy.mockResolvedValueOnce({ data: { data: { code: 'swq234' } } })
        spy.mockResolvedValueOnce({ data: { data: { token: 'sw234' } } })
        spy.mockResolvedValueOnce({ data: { url: 'dumy.url' } })
        const successPromise = (file: File) => {
            const newFile = new File([file], 'new_name.docx', { type: file.type })
            return Promise.resolve(newFile)
        }
        const failPromise = () => {
            return Promise.reject('wrong type')
        }
        const wrapper = shallowMount(Uploader as any, {
            props: {
                actions: 'test.url',
                beforeUpload: failPromise,
            },
        })
        // 测试上传reject失败
        const fileInput = wrapper.get('input').element as HTMLInputElement
        setInputValue(fileInput)
        await wrapper.get('input').trigger('change')
        await flushPromises()
        expect(wrapper.findAll('li').length).toBe(0)
        // test promise with wrong type
        // 测试 promise with file
        await wrapper.setProps({ beforeUpload: successPromise })
        await wrapper.get('input').trigger('change')
        await flushPromises()
        // vi.useFakeTimers()
        // await vi.runAllTicks()
        const firstItem = wrapper.get('li:first-child')
        expect(firstItem.classes()).toContain('upload-success')
        expect(firstItem.get('.filename').text()).toBe('new_name.docx')
    })

    afterAll(() => {
        spy.mockReset()
    })
})
