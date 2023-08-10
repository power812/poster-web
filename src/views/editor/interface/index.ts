import { TextComponentTypeProps } from '../../../components/defaultAttr'
// export type TableDataType = {
//     [P in keyof TextComponentTypeProps]: {
//         componentName?: string
//         value?: string
//         extraAntAttr?: Object
//     }
// }

export type componentsMapTYpe = {
    [p in keyof TextComponentTypeProps]?: {
        componentName: string | undefined
        extraAntAttr?: { [key: string]: any }
        text?: string
        subComponentName?: string
        options?: { [key: string]: any }[]
        value?: string
        transformDataType?: (data: any) => any
    }
}
