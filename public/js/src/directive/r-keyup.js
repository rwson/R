/**
 * r-keyup指令
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["tool", "event", "dirBase"], function (Tool, Event, dirBase) {
            return factory(root, Tool, Event, dirBase);
        });
    }

}(window, function (root, Tool, Event, dirBase, undefined) {

    function RKeyUp(dirCfg) {
        dirBase.call(this, dirCfg);
        this.context = root;
        return this;
    }

    RKeyUp.prototype = {

        "constructor": RKeyUp,

        "link": function (el, exp, scope, context) {
            //  修正scope
            this.scope = this.scope || scope;
            Event.removeEvent(el, "keyup", exp);
            Event.addEvent(el, "keyup", exp);
        }

    };

    return {
        "name": "RKeyUp",
        "type": "event",
        "constructor": RKeyUp
    };

}));
