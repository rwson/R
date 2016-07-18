/**
 * r-click指令
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["tool", "event"], function (Tool, Event) {
            return factory(root, Tool, Event);
        });
    } else {
        root.RClick = RClick;
    }

}(window, function (root, Tool, Event, undefined) {

    function RClick() {
        return this;
    }

    RClick.prototype = {

        "constructor": RClick,

        "link": function (el, exp, scope) {
            Event.removeEvent(el, "click", exp);
            Event.addEvent(el, "click", exp);
        }
    };

    return {
        "name": "RClick",
        "constructor": RClick
    };

}));
