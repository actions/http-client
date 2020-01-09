import * as httpm from '../_out';
import * as path from 'path';
import * as am from '../_out/auth';
import * as fs from 'fs';

let sampleFilePath: string = path.join(__dirname, 'testoutput.txt');

describe('basics', () => {
    let _http: httpm.HttpClient;
    let _httpbin: httpm.HttpClient;

    beforeEach(() => {
        _http = new httpm.HttpClient('typed-test-client-tests', [], { keepAlive: true });
    })
  
    afterEach(() => {

    })
  
    it('does basic http get request with keepAlive true', async() => {
        let res: httpm.HttpClientResponse = await _http.get('http://httpbin.org/get');
        expect(res.message.statusCode).toBe(200);
        let body: string = await res.readBody();      
        let obj:any = JSON.parse(body);
        expect(obj.url).toBe("https://httpbin.org/get");
    });

    it('does basic head request with keepAlive true', async() => {
        let res: httpm.HttpClientResponse = await _http.head('http://httpbin.org/get');
        expect(res.message.statusCode).toBe(200);
    });

    it('does basic http delete request with keepAlive true', async() => {
        let res: httpm.HttpClientResponse = await _http.del('http://httpbin.org/delete');
        expect(res.message.statusCode).toBe(200);
        let body: string = await res.readBody();      
        let obj:any = JSON.parse(body);
    });
    
    it('does basic http post request with keepAlive true', async() => {
        let b: string = 'Hello World!';
        let res: httpm.HttpClientResponse = await _http.post('http://httpbin.org/post', b);
        expect(res.message.statusCode).toBe(200);
        let body: string = await res.readBody();
        let obj:any = JSON.parse(body);
        expect(obj.data).toBe(b);
        expect(obj.url).toBe("https://httpbin.org/post");
    }); 
    
    it('does basic http patch request with keepAlive true', async() => {
        let b: string = 'Hello World!';
        let res: httpm.HttpClientResponse = await _http.patch('http://httpbin.org/patch', b);
        expect(res.message.statusCode).toBe(200);
        let body: string = await res.readBody();
        let obj:any = JSON.parse(body);
        expect(obj.data).toBe(b);
        expect(obj.url).toBe("https://httpbin.org/patch");
    }); 
    
    it('does basic http options request with keepAlive true', async() => {
        let res: httpm.HttpClientResponse = await _http.options('http://httpbin.org');
        expect(res.message.statusCode).toBe(200);
        let body: string = await res.readBody();
    });    
});
