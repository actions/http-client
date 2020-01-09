import * as pm from '../_out/proxy';
import * as url from 'url';

describe('proxy', () => {
    beforeEach(() => {

    })
  
    afterEach(() => {

    })
  
    it('does not return proxyUrl if variables not set', () => {
        _clearVars();
        let proxyUrl = pm.getProxyUrl(url.parse('https://github.com'));
        expect(proxyUrl).toBeUndefined();
    })

    it('returns proxyUrl if https_proxy set for https url', () => {
        _clearVars();
        process.env["https_proxy"] = "https://myproxysvr";
        let proxyUrl = pm.getProxyUrl(url.parse('https://github.com'));
        expect(proxyUrl).toBeDefined();
    })

    it('does not return proxyUrl if http_proxy set for https url', () => {
        _clearVars();
        process.env["http_proxy"] = "https://myproxysvr";
        let proxyUrl = pm.getProxyUrl(url.parse('https://github.com'));
        expect(proxyUrl).toBeUndefined();
    })
    
    it('returns proxyUrl if http_proxy set for http url', () => {
        _clearVars();
        process.env["http_proxy"] = "http://myproxysvr";
        let proxyUrl = pm.getProxyUrl(url.parse('http://github.com'));
        expect(proxyUrl).toBeDefined();
    })

    it('does not return proxyUrl if only host as no_proxy list', () => {
        _clearVars();
        process.env["https_proxy"] = "https://myproxysvr";
        process.env["no_proxy"] = "myserver"
        let proxyUrl = pm.getProxyUrl(url.parse('https://myserver'));
        expect(proxyUrl).toBeUndefined();
    })
    
    it('does not return proxyUrl if host in no_proxy list', () => {
        _clearVars();
        process.env["https_proxy"] = "https://myproxysvr";
        process.env["no_proxy"] = "otherserver,myserver,anotherserver:8080"
        let proxyUrl = pm.getProxyUrl(url.parse('https://myserver'));
        expect(proxyUrl).toBeUndefined();
    })
    
    it('does not return proxyUrl if host in no_proxy list with spaces', () => {
        _clearVars();
        process.env["https_proxy"] = "https://myproxysvr";
        process.env["no_proxy"] = "otherserver, myserver ,anotherserver:8080"
        let proxyUrl = pm.getProxyUrl(url.parse('https://myserver'));
        expect(proxyUrl).toBeUndefined();
    })
    
    it('does not return proxyUrl if host in no_proxy list with ports', () => {
        _clearVars();
        process.env["https_proxy"] = "https://myproxysvr";
        process.env["no_proxy"] = "otherserver, myserver:8080 ,anotherserver"
        let proxyUrl = pm.getProxyUrl(url.parse('https://myserver:8080'));
        expect(proxyUrl).toBeUndefined();
    })    
    
    it('returns proxyUrl if https_proxy set and not in no_proxy list', () => {
        _clearVars();
        process.env["https_proxy"] = "https://myproxysvr";
        process.env["no_proxy"] = "otherserver, myserver ,anotherserver:8080"
        let proxyUrl = pm.getProxyUrl(url.parse('https://github.com'));
        expect(proxyUrl).toBeDefined();
    })
    
    it('returns proxyUrl if https_proxy set empty no_proxy set', () => {
        _clearVars();
        process.env["https_proxy"] = "https://myproxysvr";
        process.env["no_proxy"] = ""
        let proxyUrl = pm.getProxyUrl(url.parse('https://github.com'));
        expect(proxyUrl).toBeDefined();
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