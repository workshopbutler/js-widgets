import * as JQuery from 'jquery';
import IApiResponse from '../interfaces/IApiResponse';
import IError from '../interfaces/IError';
import {logError} from './Error';

declare var BACKEND_URL: string;
declare var API_VERSION: string;

/**
 * Performs cross-site AJAX requests
 */
class Transport {
  isFrameLoaded: boolean = false;
  callbacks: any = {};
  private iframe: HTMLIFrameElement;
  private messageStack: object[] = [];

  constructor() {
    $(window).on('message', this.addMessageListener.bind(this));
  }

  /**
   * Makes GET request via ajax
   * @param {string} url
   * @param {object} data
   * @param {Function} callbackSuccess
   * @param {Function} callbackError
   */
  get(url: string, data: object, callbackSuccess: (response: any) => void, callbackError?: (error: IError) => void) {
    const withVersion = `${url}&version=${API_VERSION}`;
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
        callbackSuccess(response.response);
      }
    });
  }

  post(url: string, data: any, callbackSuccess: (response: any) => void) {
    this.makeFrameRequest('POST', url, data, callbackSuccess);
  }

  put(url: string, data: any, callbackSuccess: (response: any) => void) {
    this.makeFrameRequest('PUT', url, data, callbackSuccess);
  }

  delete(url: string, data: any, callbackSuccess: (response: any) => void) {
    this.makeFrameRequest('DELETE', url, data, callbackSuccess);
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

    const self = this;
    this.iframe.onload = function () {
      if (self.messageStack.length > 0) {
        self.messageStack.forEach(function (value) {
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

  private makeFrameRequest(method: string, url: string, data: any, callbackSuccess: (response: any) => void) {
    const that = this;
    const callbackId = 'cb' + (Math.random() * 100).toString().replace(/\./g, '');

    this.callbacks[callbackId] = (response: any) => {
      if (callbackSuccess) {
        callbackSuccess(response);
      }

      delete that.callbacks[callbackId];
    };

    const withVersion = `${url}&version=${API_VERSION}`;
    this.sendToFrame({
      cb: callbackId,
      data: JSON.stringify(data),
      method,
      url: withVersion,
    });

    return false;
  }

  private addMessageListener(e: JQuery.TriggeredEvent) {
    if (!e.originalEvent) {
      return;
    }
    const event = (e.originalEvent as MessageEvent);
    const backendUrlWithoutSlack = BACKEND_URL.replace(/\/$/, '');
    const originWithoutSlack = event.origin.replace('\/$', '');
    if (originWithoutSlack !== backendUrlWithoutSlack) {
      return;
    }
    if (event.data.cb && typeof this.callbacks[event.data.cb] === 'function') {
      this.callbacks[event.data.cb](event.data);
    }
  }

  private makeUrl(url?: string): string {
    if (url) {
      return BACKEND_URL + url;
    } else {
      return BACKEND_URL + 'stub';
    }
  }
}

const transport = new Transport();

export default transport;
