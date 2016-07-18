/**
 * r-click指令
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["tool", "event"], function (Tool, Event) {
            return factory(root, Tool, Event);
        });
    }

}(window, function (root, Tool, Event, undefined) {

    function RClick(dirCfg) {
        this.el = dirCfg.el;
        this.scope = dirCfg.scope;
        this.exp = dirCfg.directives[0].exp;
        return this;
    }

    RClick.prototype = {

        "constructor": RClick,

        "link": function (el, exp, scope) {
            //  修正scope
            this.scope = this.scope || scope;
            Event.removeEvent(el, "click", exp);
            Event.addEvent(el, "click", exp);
        }
    };

    return {
        "name": "RClick",
        "constructor": RClick
    };

}));
