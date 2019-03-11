"use strict";

export default class Widget {
    constructor(selector) {
        this.$root = $(selector);
        this.locals = this._getDom();
        this.maxHeight = this.$root.data("max-height") || 65;

        this.setToggleState();
        this._assignEvent();
    }

    _getDom() {
        const $root = this.$root;

        return {
            $text: $root.find("[data-flip-text]"),
            $heightHelper: $root.find("[data-flip-helper]"),
        };
    }

    _assignEvent() {
        this.$root.on("click", "[data-flip-link]", this.toggleText.bind(this));
        $(window).resize(this.setToggleState.bind(this));
    }

    toggleText(e) {
        e && e.preventDefault();

        const $root = this.$root;
        const isShowFull = !$root.hasClass("b-flip_open");

        $root.toggleClass("b-flip_open", isShowFull);
    }

    setToggleState() {
        const isShowToggleLink = !(this.locals.$heightHelper.height() < this.maxHeight);
        this.$root.toggleClass("b-flip_show-link", isShowToggleLink);
    }

    // static
    static init(selector) {
        const $elems = $(selector);
        if (!$elems.length) { return; }

        return $elems.each(function(index, el) {
            let $element = $(el);
            let data     = $element.data("widget-text-flip");

            if (!data) {
                data = new Widget(el);
                $element.data("widget-text-flip", data);
            }
        });
    }
}
