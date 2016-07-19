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

    function RKeyUp(dirCfg) {
        this.priority = 2;
        this.el = dirCfg.el;
        this.scope = dirCfg.scope;
        this.exp = dirCfg.directives[0].exp;
        return this;
    }

    RKeyUp.prototype = {

        "constructor": RKeyUp,

        "link": function (el, exp, scope) {
            //  修正scope
            this.scope = this.scope || scope;
            Event.removeEvent(el, "keyup", exp);
            Event.addEvent(el, "keyup", exp);
        }
    };

    return {
        "name": "RKeyUp",
        "priority": 2,
        "constructor": RKeyUp
    };

}));
