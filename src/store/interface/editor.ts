// import { TextComponentTypeProps } from '../../components/defaultAttr/index.ts'
import { AllComponentProps } from 'lego-bricks'
export interface EditorProps {
    components: ComponentDataType[]
    currentElement: string
}

export interface ComponentDataType {
    props: Partial<AllComponentProps>
    id: string
    name: string
    layerName: string
    isLocked?: boolean
    isHidden?: boolean
}
