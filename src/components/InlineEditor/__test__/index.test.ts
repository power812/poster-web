import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { VueWrapper, flushPromises, mount, shallowMount } from '@vue/test-utils'
import InlineEditor from '../index.vue'
import { nextTick } from 'vue'
let wrapper: VueWrapper<any>
describe('InputEdit component', () => {
    beforeAll(() => {
        wrapper = mount(InlineEditor as any, {
            props: {
                value: 'test',
            },
            slots: {
                default: '<template #default="{ text }"><h2>{{text}}</h2></template>',
            },
        })
    })
    it('should render the default layout', () => {
        expect(wrapper.get('h2').text()).toBe('test')
    })
    it('should render input when clicking the element', async () => {
        await wrapper.trigger('click')
        expect(wrapper.find('input').exists()).toBeTruthy()
        const input = wrapper.get('input').element as HTMLInputElement
        expect(input.value).toBe('test')
    })
    it('press enter shoulde render newValue', async () => {
        await wrapper.get('input').setValue('testnew')
        const event = new KeyboardEvent('keydown', { key: 'Enter' })
        document.dispatchEvent(event)
        await nextTick()
        expect(wrapper.find('h2').exists()).toBeTruthy()
        expect(wrapper.find('h2').text()).toBe('testnew')
    })
    it('press enter should render to default layout with new value', async () => {
        await wrapper.trigger('click')
        await wrapper.get('input').setValue('test123')
        const event = new KeyboardEvent('keydown', { key: 'Escape' })
        document.dispatchEvent(event)
        await nextTick()
        expect(wrapper.find('h2').exists()).toBeTruthy()
        expect(wrapper.get('h2').text()).toBe('testnew')
    })
    it('click outside should render to default layout with new value', async () => {
        await wrapper.trigger('click')
        await wrapper.get('input').setValue('testupdated')
        const event = new MouseEvent('click')
        document.dispatchEvent(event)
        await nextTick()
        expect(wrapper.find('h2').exists()).toBeTruthy()
        expect(wrapper.get('h2').text()).toBe('testupdated')
    })
})
