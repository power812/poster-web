export interface RespType<T> {
    errno: number
    data: T
}
export interface ListType<T> {
    count: number
    list: T[]
}
export type RespListDataType<T> = RespType<ListType<T>>

export interface TemplateType {
    id: number
    title: string
    coverImg: string
    author: string
    copiedCount: number
    isHot: boolean
    isNew: boolean
}
