export type UploadStatusType = 'ready' | 'loading' | 'success' | 'error'
export interface UploadFileType {
    uid: string
    size: number
    name: string
    status: UploadStatusType
    raw: File
    resp?: any
}
export type CheckUploadType = (file: File) => boolean | Promise<File>
