import zlib = require('zlib');
import {IHttpClientResponse} from './interfaces'

/**
 * Decompress/Decode gzip encoded JSON
 * Using Node.js built-in zlib module
 *
 * @param {Buffer} buffer
 * @param {string} charset
 * @return {Promise<string>}
 */
export function decompressGzippedContent(buffer: Buffer, charset: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        zlib.gunzip(buffer, function (error, buffer) {
            if (error) {
                reject(error);
            }

            resolve(buffer.toString(charset));
        });
    })
}

/**
 * Obtain Response's Content Charset.
 * Through inspecting `content-type` response header.
 * It Returns 'utf-8' if NO charset specified/matched.
 *
 * @param {IHttpClientResponse} response
 * @return {string} - Content Encoding Charset; Default=utf-8
 */
export function obtainContentCharset (response: IHttpClientResponse) : string {
  // Find the charset, if specified.
  // Search for the `charset=CHARSET` string, not including `;,\r\n`
  // Example: content-type: 'application/json;charset=utf-8'
  // |__ matches would be ['charset=utf-8', 'utf-8', index: 18, input: 'application/json; charset=utf-8']
  // |_____ matches[1] would have the charset :tada: , in our example it's utf-8
  // However, if the matches Array was empty or no charset found, 'utf-8' would be returned by default.

  const contentType: string = response.message.headers['content-type'] || '';
  const matches: (RegExpMatchArray|null) = contentType.match(/charset=([^;,\r\n]+)/i);

  return (matches && matches[1]) ? matches[1] : 'utf-8';
}
