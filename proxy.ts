import { CLIENT_RENEG_WINDOW } from "tls"

export function getProxyUrl(reqUrl: URL): URL | undefined {
  let usingSsl = reqUrl.protocol === 'https:'

  let proxyUrl: URL
  if (checkBypass(reqUrl)) {
    return proxyUrl
  }

  let proxyVar: string
  if (usingSsl) {
    proxyVar = process.env['https_proxy'] || process.env['HTTPS_PROXY']
  } else {
    proxyVar = process.env['http_proxy'] || process.env['HTTP_PROXY']
  }

  if (proxyVar) {
    proxyUrl = new URL(proxyVar)
  }

  return proxyUrl
}

export function checkBypass(reqUrl: URL): boolean {
  const noProxy = process.env['no_proxy'] || process.env['NO_PROXY']
  if (!(reqUrl.hostname && noProxy)) {
    return false
  }

  const upHost = reqUrl.hostname.toUpperCase()
  // Format the request hostname and hostname with port
  const upperReqHosts = [upHost]

  // Determine the request port and add that to list to check
  let reqPort = Number(reqUrl.port)
  if (!reqPort) {
    switch (reqUrl.protocol) {
      case 'http:':
        reqPort = 80
        break;
      case 'https:':
        reqPort = 443
        break;
    }
  }
  upperReqHosts.push(`${upHost}:${reqPort}`)

  const upHosts = noProxy.split(',').map(x => x.trim().toUpperCase()).filter(x => x)

  // Compare request host against noproxy
  for (const host of upHosts) {
    if (host[0] === '.' && upperReqHosts.some(h => h.endsWith(host))) {
      return true
    }
    if (upperReqHosts.some(x => x === host)) {
      return true
    }
  }

  return false
}
