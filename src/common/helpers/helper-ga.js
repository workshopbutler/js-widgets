"use strict";

import template from "./../../common/templates/template-ga.ejs";

export default class GoogleAnalyticsTracker {
    constructor(options) {
        this.trackingIds = options.ids;
        this.category = options.category;
        this.label = options.label;

        this.loadGA();
    }

    sendEvent(actionType = "") {
        if (typeof ga !== "undefined" && ga.hasOwnProperty("loaded") && ga.loaded === true) {
            for (let name in this.trackingIds) {
                let commandName = name + ".send";
                ga(commandName, "event", {
                    "eventCategory" : this.category,
                    "eventAction" : actionType,
                    "eventLabel" : this.label,
                });
            }
        }
    }

    loadGA() {
        const temp = template({ids: this.trackingIds});
        $("body").append(temp);
    }
}
