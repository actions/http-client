import * as url from 'url';

export function getProxyUrl(reqUrl: url.Url): url.Url {
    let usingSsl = reqUrl.protocol === 'https:';

    let noProxy: string = process.env["no_proxy"] || 
                            process.env["NO_PROXY"];

    let bypass: boolean;
    if (noProxy && typeof noProxy === 'string') {
        let bypassList = noProxy.split(',');
        for (let i=0; i < bypassList.length; i++) {
            let item = bypassList[i];
            if (item && 
                typeof item === "string" && 
                reqUrl.host.toLocaleLowerCase() == item.trim().toLocaleLowerCase()) {
                    bypass = true;
                    break;
            }
        }            
    }

    let proxyUrl: url.Url;
    if (bypass) {
        return proxyUrl;
    }
    
    let proxyVar: string;
    if (usingSsl) {
        proxyVar = process.env["https_proxy"] ||
                    process.env["HTTPS_PROXY"];
        
    } else {
        proxyVar = process.env["http_proxy"] ||
                    process.env["HTTP_PROXY"];
    }
    
    if (proxyVar) {
        proxyUrl = url.parse(proxyVar);
    }

    return proxyUrl;
}