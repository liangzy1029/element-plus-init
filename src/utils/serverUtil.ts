/**
 * 获取文件服务可访问地址
 */
export function accessibleFileUrl(uri: string | undefined | null, baseUrl = '') {
  if (!uri) {
    return undefined
  }
  const host = baseUrl ? baseUrl : fileBaseUrl()
  return host ? `${host.replace(/\/$/, '')}/${uri.replace(/^\//, '')}` : uri
}

/**
 * 获取文件服务基本地址
 */
export function fileBaseUrl() {
  return import.meta.env.VITE_FILE_BASE_URL ?? ''
}
