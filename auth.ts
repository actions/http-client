import ifm = require("./interfaces");

export class BasicCredentialHandler implements ifm.IRequestHandlerWithoutAuth {
  username: string;
  password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  prepareRequest(options: any): void {
    options.headers["Authorization"] =
      "Basic " +
      Buffer.from(this.username + ":" + this.password).toString("base64");
  }

  // This handler cannot handle 401
  canHandleAuthentication(): false {
    return false;
  }
}

export class BearerCredentialHandler implements ifm.IRequestHandlerWithoutAuth {
  token: string;

  constructor(token: string) {
    this.token = token;
  }

  // currently implements pre-authorization
  // TODO: support preAuth = false where it hooks on 401
  prepareRequest(options: any): void {
    options.headers["Authorization"] = "Bearer " + this.token;
  }

  // This handler cannot handle 401
  canHandleAuthentication(response: ifm.IHttpClientResponse): false {
    return false;
  }
}

export class PersonalAccessTokenCredentialHandler
  implements ifm.IRequestHandlerWithoutAuth {
  token: string;

  constructor(token: string) {
    this.token = token;
  }

  // currently implements pre-authorization
  // TODO: support preAuth = false where it hooks on 401
  prepareRequest(options: any): void {
    options.headers["Authorization"] =
      "Basic " + Buffer.from("PAT:" + this.token).toString("base64");
  }

  // This handler cannot handle 401
  canHandleAuthentication(response: ifm.IHttpClientResponse): false {
    return false;
  }
}
