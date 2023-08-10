import { describe, expect, it, vi } from 'vitest'
describe('test cb', () => {
    it('测试回调', () => {
        const fn = (cb: (data: string) => void) => {
            cb('hello')
        }
        fn((data) => {
            expect(data).toBe('hello')
        })
    })
    // it('测试异步回调', (done) => {
    //     const fn = (cb) => {
    //         setTimeout(() => {
    //             cb('hello')
    //             done()
    //         }, 100)

    //     }
    //     fn((data) => {
    //         expect(data).toBe('hello')
    //     })
    // })
    vi.useFakeTimers()
    it('测试异步 Times', () => {
        const fn = (cb: (data: string) => void) => {
            setTimeout(() => {
                cb('hello')
            }, 1000)
        }
        const mockfn = vi.fn()
        fn(mockfn)
        expect(mockfn).not.toHaveBeenCalled()
        vi.runAllTimers()
        expect(mockfn).toHaveBeenCalled()
        expect(mockfn).toHaveBeenCalledWith('hello')
    })
    it('测试异步 Times  控制时间', () => {
        const fn = (cb: (data: string) => void) => {
            setTimeout(() => {
                cb('hello')
                setTimeout(() => {
                    cb('two')
                }, 2000)
            }, 1000)
        }
        const mockfn = vi.fn()
        fn(mockfn)
        expect(mockfn).not.toHaveBeenCalled()
        vi.runOnlyPendingTimers()
        // jest.runAllTimers()
        expect(mockfn).toHaveBeenCalled()
        expect(mockfn).toHaveBeenCalledTimes(1)
        expect(mockfn).toHaveBeenCalledWith('hello')
        vi.runOnlyPendingTimers()
        expect(mockfn).toHaveBeenCalled()
        expect(mockfn).toHaveBeenCalledTimes(2)
        expect(mockfn).toHaveBeenCalledWith('two')
        // jest.advanceTimersByTime(500)
    })
    const testPromise = () => {
        return Promise.resolve('hello')
    }
    it('测试promiest', () => {
        testPromise().then((data) => {
            expect(data).toBe('hello')
        })
    })
    it('test async await', async () => {
        const data = await testPromise()
        expect(data).toBe('hello')
    })
    it('test async await resolves', async () => {
        return expect(testPromise()).resolves.toBe('hello')
    })
    const rejectPromise = () => {
        return Promise.reject('error')
    }
    it('test reject error', () => {
        return expect(rejectPromise()).rejects.toBe('error')
    })
    // ------mockfn -------------
    const fn = (flag: boolean, cb: (data: number) => void) => {
        if (flag) cb(22)
        return 22
    }
    it('test mockfn', () => {
        const mockfn = vi.fn()
        fn(true, mockfn)
        expect(mockfn).toHaveBeenCalled()
        expect(mockfn).toHaveBeenCalledWith(22)
        expect(mockfn).toHaveBeenCalledTimes(1)
    })
    // -----------  axios ----------
    // const axios = require('axios')
    // interface resType {
    //     data:{
    //         username: string
    //     }
    // }
    // const getUserName = (id:number) => {
    //     return axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)
    //         .then((res:resType) => {
    //             return res.data.username
    //         })
    // }
    // vi.mock('axios')
    // 替换
    // axios.get.mockImplementation(() => {
    //     return Promise.resolve({ data: { username: 'power' } })
    // })
    // axios.get.mockResolvedValue({ data: { username: 'power' } })
    // it('test axios', () => {
    //     return getUserName(1).then(() => {
    //         expect(axios.get).toHaveBeenCalled()
    //         expect(axios.get).toHaveBeenCalledTimes(1)

    //     })
    // })
})
