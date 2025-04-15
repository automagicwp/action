import { getInput } from '@actions/core'
import type {
  ApiOptions,
  CreateNewVersionInput,
  WPUpdateHubAction
} from './types'
import { WPUPDATEHUB_API_BASE } from './constants'

export const getWorkflowInput = (): {
  GITHUB_TOKEN: string
  WPUPDATEHUB_SECRET: string
  WPUPDATEHUB_ACTION: WPUpdateHubAction
  WPUPDATEHUB_PLUGIN_ID: string
  ARTIFACT_URL: string
} => {
  const GITHUB_TOKEN = getInput('github-token')
  const WPUPDATEHUB_SECRET = getInput('wpupdatehub-secret', { required: true })
  const WPUPDATEHUB_ACTION = getInput('wpupdatehub-action') as WPUpdateHubAction
  const WPUPDATEHUB_PLUGIN_ID = getInput('wpupdatehub-plugin-id')
  const ARTIFACT_URL = getInput('wpupdatehub-artifact-zip-url')

  return {
    ARTIFACT_URL,
    GITHUB_TOKEN,
    WPUPDATEHUB_SECRET,
    WPUPDATEHUB_ACTION,
    WPUPDATEHUB_PLUGIN_ID
  }
}

const commonHeaders = (secret: string) => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${secret}`
  } as Record<string, string>

  return headers
}

export async function createNewVersion(
  config: CreateNewVersionInput,
  { secret }: ApiOptions
) {
  return await fetch(`${WPUPDATEHUB_API_BASE}/plugin/update`, {
    method: 'POST',
    headers: commonHeaders(secret),
    body: JSON.stringify(config)
  })
}
