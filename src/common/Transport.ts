import IApiResponse from '../interfaces/IApiResponse';
import IError from '../interfaces/IError';
import {logError} from './Error';
import ISuccess from '../interfaces/ISuccess';
import IPlainObject from '../interfaces/IPlainObject';

declare let BACKEND_URL: string;
declare let API_VERSION: string;

/**
 * Performs cross-site AJAX requests
 */
class Transport {
  isFrameLoaded = false;
  successCallbacks: any = {};
  failureCallbacks: any = {};
  private iframe: HTMLIFrameElement;
  private messageStack: object[] = [];

  constructor() {
    window.addEventListener('message', this.addMessageListener.bind(this), false);
  }

  /**
   * Makes GET request via ajax
   * @param {string} url
   * @param {object} data
   * @param {Function} callbackSuccess
   * @param {Function} callbackError
   */
  get(url: string,
      data: object,
      callbackSuccess: (response: ISuccess) => void,
      callbackError?: (error: IError) => void) {
    const withVersion = `${url}&api_version=${API_VERSION}`;
    const settings = {
      crossDomain: true,
      data: $.extend(true, {}, data),
      dataType: 'jsonp',
      url: this.makeUrl(withVersion),
    };
    $.ajax(settings).done((response: IApiResponse) => {
      if (response.status >= 400) {
        const error = response.response as IError;
        const msg = error.info ? `${error.message}, additional info: ${error.info}` : error.message;
        logError(msg);
        if (callbackError) {
          callbackError(error);
        }
      } else {
        callbackSuccess(this.convertResponse(response.response));
      }
    });
  }

  post(url: string, data: any, callbackSuccess: (response: any) => void, callbackFailure?: (response: any) => void) {
    this.makeFrameRequest('POST', url, data, callbackSuccess, callbackFailure);
  }

  put(url: string, data: any, callbackSuccess: (response: any) => void) {
    this.makeFrameRequest('PUT', url, data, callbackSuccess);
  }

  delete(url: string, data: any, callbackSuccess: (response: any) => void) {
    this.makeFrameRequest('DELETE', url, data, callbackSuccess);
  }

  private convertResponse(json: IPlainObject): ISuccess {
    return {
      version: json.version,
      total: json.total,
      perPage: json.per_page,
      page: json.page,
      data: json.data,
    };
  }

  private sendToFrame(message: object) {
    let frameWindow: Window;

    if (this.iframe) {
      if (this.isFrameLoaded && this.iframe.contentWindow) {
        frameWindow = this.iframe.contentWindow;
        frameWindow.postMessage(message, BACKEND_URL);
        return false;
      } else {
        this.messageStack.push(message);
        return false;
      }
    }
    this.iframe = this.createIFrame();

    if (!this.iframe.contentWindow) {
      this.messageStack.push(message);
      return false;
    }
    frameWindow = this.iframe.contentWindow;

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    this.iframe.onload = function() {
      if (self.messageStack.length > 0) {
        self.messageStack.forEach(value => {
          frameWindow.postMessage(value, BACKEND_URL);
        });

        self.messageStack = [];
      } else {
        frameWindow.postMessage(message, BACKEND_URL);
      }
      self.isFrameLoaded = true;
    }.bind(this);

    return true;
  }

  /**
   * Creates an iframe to send requests
   */
  private createIFrame(): HTMLIFrameElement {
    const iframe: HTMLIFrameElement = document.createElement('iframe');

    $(iframe).css({
      height: '1px',
      left: '-999px',
      position: 'absolute',
      top: '-999px',
      width: '1px',
    });

    iframe.src = this.makeUrl();
    document.body.appendChild(iframe);
    return iframe;
  }

  private makeFrameRequest(method: string, url: string, data: any,
                           callbackSuccess?: (response: any) => void,
                           callbackFailure?: (response: any) => void) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    const callbackId = 'cb' + (Math.random() * 100).toString().replace(/\./g, '');

    this.successCallbacks[callbackId] = (response: any) => {
      if (callbackSuccess) {
        callbackSuccess(response);
      }

      delete that.successCallbacks[callbackId];
    };
    this.failureCallbacks[callbackId] = (response: any) => {
      if (callbackFailure) {
        callbackFailure(response);
      }
      delete that.failureCallbacks[callbackId];
    };

    const withVersion = `${url}&api_version=${API_VERSION}&callback=jswidgets`;
    this.sendToFrame({
      cb: callbackId,
      data: JSON.stringify(data),
      method,
      url: withVersion,
    });

    return false;
  }

  private addMessageListener(event: MessageEvent) {
    const backendUrlWithoutSlack = this.updateLocalOrigin(BACKEND_URL).replace(/\/$/, '');
    const originWithoutSlack = event.origin.replace('\/$', '');
    if (originWithoutSlack !== backendUrlWithoutSlack) {
      return;
    }
    if (event.data.cb) {
      if (event.data.status >= 400 && typeof this.failureCallbacks[event.data.cb] === 'function') {
        this.failureCallbacks[event.data.cb](event.data.response);
      } else if (typeof this.successCallbacks[event.data.cb] === 'function') {
        this.successCallbacks[event.data.cb](event.data.response);
      }
    }
  }

  private makeUrl(url?: string): string {
    if (url) {
      return BACKEND_URL + url;
    } else {
      return BACKEND_URL + 'stub';
    }
  }

  /**
   * Replaces the URL on a development server otherwise the origin check fails
   * @param url {string} Backend URL
   */
  private updateLocalOrigin(url: string): string {
    if (url === 'http://127.0.0.1:9000/api-new/') {
      return 'http://127.0.0.1:9000';
    } else {
      return url;
    }
  }
}

const transport = new Transport();

export default transport;
