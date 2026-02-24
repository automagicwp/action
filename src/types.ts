export type ApiErrorResponse = {
  message: string
  errors?: Record<string, { message: string; errorCode: string }[]>
}

export type UploadUrlResponse = {
  presignedUrl: string
  objectKey: string
}

export type ConfirmUploadResponse = {
  id: string
  version: string
}
