/**
 * r-click指令
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["tool", "event", "dirBase"], function (Tool, Event, dirBase) {
            return factory(root, Tool, Event, dirBase);
        });
    }

}(window, function (root, Tool, Event, dirBase, undefined) {

    function RClick(dirCfg) {
        dirBase.call(this, dirCfg);
        this.priority = 2;
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
        "priority": 2,
        "constructor": RClick
    };

}));
