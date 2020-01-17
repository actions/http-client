import * as http from 'http'
import * as httpm from '../_out';
import * as pm from '../_out/proxy';
import * as proxy from 'proxy'
import * as url from 'url';

let _proxyConnects: string[]
let _proxyServer: http.Server
let _proxyUrl = 'http://127.0.0.1:8080'

describe('proxy', () => {
    beforeAll(async () => {
        // Start proxy server
        _proxyServer = proxy()
        await new Promise((resolve) => {
            const port = Number(_proxyUrl.split(':')[2])
            _proxyServer.listen(port, () => resolve())
        })
        _proxyServer.on('connect', (req) => {
            _proxyConnects.push(req.url)
        });
    })

    beforeEach(() => {
        _proxyConnects = []
        _clearVars()
    })
  
    afterEach(() => {
    })

    afterAll(async() => {
        _clearVars()

        // Stop proxy server
        await new Promise((resolve) => {
            _proxyServer.once('close', () => resolve())
            _proxyServer.close()
        })
    })

    it('does not return proxyUrl if variables not set', () => {
        let proxyUrl = pm.getProxyUrl(url.parse('https://github.com'));
        expect(proxyUrl).toBeUndefined();
    })

    it('returns proxyUrl if https_proxy set for https url', () => {
        process.env["https_proxy"] = "https://myproxysvr";
        let proxyUrl = pm.getProxyUrl(url.parse('https://github.com'));
        expect(proxyUrl).toBeDefined();
    })

    it('does not return proxyUrl if http_proxy set for https url', () => {
        process.env["http_proxy"] = "https://myproxysvr";
        let proxyUrl = pm.getProxyUrl(url.parse('https://github.com'));
        expect(proxyUrl).toBeUndefined();
    })
    
    it('returns proxyUrl if http_proxy set for http url', () => {
        process.env["http_proxy"] = "http://myproxysvr";
        let proxyUrl = pm.getProxyUrl(url.parse('http://github.com'));
        expect(proxyUrl).toBeDefined();
    })

    it('does not return proxyUrl if only host as no_proxy list', () => {
        process.env["https_proxy"] = "https://myproxysvr";
        process.env["no_proxy"] = "myserver"
        let proxyUrl = pm.getProxyUrl(url.parse('https://myserver'));
        expect(proxyUrl).toBeUndefined();
    })
    
    it('does not return proxyUrl if host in no_proxy list', () => {
        process.env["https_proxy"] = "https://myproxysvr";
        process.env["no_proxy"] = "otherserver,myserver,anotherserver:8080"
        let proxyUrl = pm.getProxyUrl(url.parse('https://myserver'));
        expect(proxyUrl).toBeUndefined();
    })
    
    it('does not return proxyUrl if host in no_proxy list with spaces', () => {
        process.env["https_proxy"] = "https://myproxysvr";
        process.env["no_proxy"] = "otherserver, myserver ,anotherserver:8080"
        let proxyUrl = pm.getProxyUrl(url.parse('https://myserver'));
        expect(proxyUrl).toBeUndefined();
    })
    
    it('does not return proxyUrl if host in no_proxy list with ports', () => {
        process.env["https_proxy"] = "https://myproxysvr";
        process.env["no_proxy"] = "otherserver, myserver:8080 ,anotherserver"
        let proxyUrl = pm.getProxyUrl(url.parse('https://myserver:8080'));
        expect(proxyUrl).toBeUndefined();
    })
    
    it('returns proxyUrl if https_proxy set and not in no_proxy list', () => {
        process.env["https_proxy"] = "https://myproxysvr";
        process.env["no_proxy"] = "otherserver, myserver ,anotherserver:8080"
        let proxyUrl = pm.getProxyUrl(url.parse('https://github.com'));
        expect(proxyUrl).toBeDefined();
    })
    
    it('returns proxyUrl if https_proxy set empty no_proxy set', () => {
        process.env["https_proxy"] = "https://myproxysvr";
        process.env["no_proxy"] = ""
        let proxyUrl = pm.getProxyUrl(url.parse('https://github.com'));
        expect(proxyUrl).toBeDefined();
    })

    it('does basic http get request through proxy', async () => {
        process.env['http_proxy'] = _proxyUrl
        const httpClient = new httpm.HttpClient();
        let res: httpm.HttpClientResponse = await httpClient.get('http://httpbin.org/get');
        expect(res.message.statusCode).toBe(200);
        let body: string = await res.readBody();
        let obj: any = JSON.parse(body);
        expect(obj.url).toBe("https://httpbin.org/get");
        expect(_proxyConnects).toEqual(['httpbin.org:80'])
    })

    it('does basic http get request when bypass proxy', async () => {
        process.env['http_proxy'] = _proxyUrl
        process.env['no_proxy'] = 'httpbin.org'
        const httpClient = new httpm.HttpClient();
        let res: httpm.HttpClientResponse = await httpClient.get('http://httpbin.org/get');
        expect(res.message.statusCode).toBe(200);
        let body: string = await res.readBody();
        let obj: any = JSON.parse(body);
        expect(obj.url).toBe("https://httpbin.org/get");
        expect(_proxyConnects).toHaveLength(0)
    })

    it('does basic https get request through proxy', async () => {
        process.env['https_proxy'] = _proxyUrl
        const httpClient = new httpm.HttpClient();
        let res: httpm.HttpClientResponse = await httpClient.get('https://httpbin.org/get');
        expect(res.message.statusCode).toBe(200);
        let body: string = await res.readBody();
        let obj: any = JSON.parse(body);
        expect(obj.url).toBe("https://httpbin.org/get");
        expect(_proxyConnects).toEqual(['httpbin.org:443'])
    })

    it('does basic https get request when bypass proxy', async () => {
        process.env['https_proxy'] = _proxyUrl
        process.env['no_proxy'] = 'httpbin.org'
        const httpClient = new httpm.HttpClient();
        let res: httpm.HttpClientResponse = await httpClient.get('https://httpbin.org/get');
        expect(res.message.statusCode).toBe(200);
        let body: string = await res.readBody();
        let obj: any = JSON.parse(body);
        expect(obj.url).toBe("https://httpbin.org/get");
        expect(_proxyConnects).toHaveLength(0)
    })
})

function _clearVars() {
    delete process.env.http_proxy;
    delete process.env.HTTP_PROXY;
    delete process.env.https_proxy;
    delete process.env.HTTPS_PROXY;
    delete process.env.no_proxy;
    delete process.env.NO_PROXY;
}