import * as core from '@actions/core'
import { readFileSync } from 'fs'
import { getUploadUrl, uploadZip, confirmUpload } from './utils'

export async function run(): Promise<void> {
  try {
    const apiKey = core.getInput('api-key', { required: true })
    const pluginId = core.getInput('plugin-id', { required: true })
    const zipPath = core.getInput('zip-path', { required: true })

    core.info(`Deploying plugin ${pluginId} from ${zipPath}`)

    const zipBuffer = readFileSync(zipPath).buffer as ArrayBuffer

    core.info('Getting upload URL...')
    const { presignedUrl, objectKey } = await getUploadUrl(pluginId, apiKey)

    core.info('Uploading plugin zip...')
    await uploadZip(presignedUrl, zipBuffer)

    core.info('Confirming upload...')
    const { id, version } = await confirmUpload(pluginId, objectKey, apiKey)

    core.info(`Plugin version ${version} deployed successfully (id: ${id})`)
    core.setOutput('version', version)
    core.setOutput('id', id)
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed('An unexpected error occurred')
    }
  }
}
