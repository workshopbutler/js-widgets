declare var BACKEND_URL: any;

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
    get(url: string, data: object, callbackSuccess: Function, callbackError: Function) {
        $.ajax({
            url: this.makeUrl(url),
            crossDomain: true,
            dataType: 'jsonp',

            data: $.extend(true, {}, data),
            success: callbackSuccess.bind(this),
            error: callbackError.bind(this)
        });
    }

    post(url: string, data: any, callbackSuccess: Function) {
        this.makeFrameRequest('POST', url, data, callbackSuccess)
    }

    put(url: string, data: any, callbackSuccess: Function) {
        this.makeFrameRequest('PUT', url, data, callbackSuccess)
    }

    delete(url: string, data: any, callbackSuccess: Function) {
        this.makeFrameRequest('DELETE', url, data, callbackSuccess)
    }

    private sendToFrame(message: object) {
        let frameWindow: Window;

        if (this.iframe) {
            if (this.isFrameLoaded && this.iframe.contentWindow) {
                frameWindow = this.iframe.contentWindow;
                frameWindow.postMessage(message, '*');
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
                    frameWindow.postMessage(value, '*');
                });

                self.messageStack = [];
            } else {
                frameWindow.postMessage(message, '*');
            }
            self.isFrameLoaded = true;
        }.bind(this);

        return true;
    }

    /**
     * Creates an iframe to send requests
     */
    private createIFrame(): HTMLIFrameElement {
        let iframe: HTMLIFrameElement = document.createElement('iframe');

        $(iframe).css({
            position: 'absolute',
            left: '-999px',
            top: '-999px',
            width: '1px',
            height: '1px'
        });

        iframe.src = this.makeUrl();
        document.body.appendChild(iframe);
        return iframe;
    }

    private makeFrameRequest(method: string, url: string, data: any, callbackSuccess: Function) {
        const that = this;
        const callbackId = 'cb' + (Math.random() * 100).toString().replace(/\./g, '');

        this.callbacks[callbackId] = function (response: any) {
            if (callbackSuccess) {
                callbackSuccess(response);
            }

            delete that.callbacks[callbackId];
        };

        this.sendToFrame({
            url: url,
            data: JSON.stringify(data),
            method: method,
            cb: callbackId
        });

        return false;
    }

    private addMessageListener(e: JQuery.Event) {
        let data = (e.originalEvent as MessageEvent).data;
        if (data.cb && typeof this.callbacks[data.cb] === "function") {
            this.callbacks[data.cb](data);
        }
    }

    private makeUrl(url?: string): string {
        if (url)
            return BACKEND_URL + url;
        else
            return BACKEND_URL + "stub";
    }
}

let transport = new Transport();

export default transport;
