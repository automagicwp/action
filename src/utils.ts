import { AUTOMAGICWP_API_BASE } from './constants'
import type { UploadUrlResponse, ConfirmUploadResponse } from './types'

const commonHeaders = (apiKey: string): Record<string, string> => ({
  Accept: 'application/json',
  Authorization: `Bearer ${apiKey}`
})

export async function getUploadUrl(
  pluginId: string,
  apiKey: string
): Promise<UploadUrlResponse> {
  const url = new URL(`${AUTOMAGICWP_API_BASE}/plugin/update/upload-url`)
  url.searchParams.set('plugin_id', pluginId)

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: commonHeaders(apiKey)
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Failed to get upload URL (${response.status}): ${text}`)
  }

  return response.json() as Promise<UploadUrlResponse>
}

export async function uploadZip(
  presignedUrl: string,
  zipBuffer: ArrayBuffer
): Promise<void> {
  const response = await fetch(presignedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/zip'
    },
    body: zipBuffer
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Failed to upload zip (${response.status}): ${text}`)
  }
}

export async function confirmUpload(
  pluginId: string,
  objectKey: string,
  apiKey: string
): Promise<ConfirmUploadResponse> {
  const response = await fetch(
    `${AUTOMAGICWP_API_BASE}/plugin/update/confirm`,
    {
      method: 'POST',
      headers: {
        ...commonHeaders(apiKey),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ plugin_id: pluginId, objectKey })
    }
  )

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Failed to confirm upload (${response.status}): ${text}`)
  }

  return response.json() as Promise<ConfirmUploadResponse>
}
