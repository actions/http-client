import * as url from "url";

export function getProxyUrl(reqUrl: url.Url): url.Url | undefined {
  let usingSsl = reqUrl.protocol === "https:";

  if (checkBypass(reqUrl)) {
    return undefined;
  }

  const proxyVar = usingSsl
    ? process.env["https_proxy"] || process.env["HTTPS_PROXY"]
    : process.env["http_proxy"] || process.env["HTTP_PROXY"];

  if (proxyVar) {
    return url.parse(proxyVar);
  }

  return undefined;
}

export function checkBypass(reqUrl: url.Url): boolean {
  if (!reqUrl.hostname) {
    return false;
  }

  let noProxy = process.env["no_proxy"] || process.env["NO_PROXY"] || "";
  if (!noProxy) {
    return false;
  }

  // Determine the request port
  let reqPort: number | undefined;
  if (reqUrl.port) {
    reqPort = Number(reqUrl.port);
  } else if (reqUrl.protocol === "http:") {
    reqPort = 80;
  } else if (reqUrl.protocol === "https:") {
    reqPort = 443;
  }

  // Format the request hostname and hostname with port
  let upperReqHosts = [reqUrl.hostname.toUpperCase()];
  if (typeof reqPort === "number") {
    upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
  }

  // Compare request host against noproxy
  for (let upperNoProxyItem of noProxy
    .split(",")
    .map((x) => x.trim().toUpperCase())
    .filter((x) => x)) {
    if (upperReqHosts.some((x) => x === upperNoProxyItem)) {
      return true;
    }
  }

  return false;
}
