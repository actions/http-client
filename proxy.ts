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

  // Determine the request port
  let reqPort = reqUrl.port
  if (!reqPort) {
    switch (reqUrl.protocol) {
      case 'http:':
        upperReqHosts.push(`${upHost}:80`)
        break;
      case 'https:':
        upperReqHosts.push(`${upHost}:443}`)
        break;
    }
  }

  const upHosts = noProxy.split(',').filter(x => x).map(x => x.toUpperCase())
  // Compare request host against noproxy
  for (const host of upHosts) {
    // The closest to a "spec" there is: https://curl.haxx.se/docs/manual.html#environment-variables
    if (host[0] === '.' && upperReqHosts.some(h => host.endsWith(h))) {
      return true
    }
    if (upperReqHosts.some(x => x === host)) {
      return true
    }
  }

  return false
}
