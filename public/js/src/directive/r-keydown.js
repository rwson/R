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

    function RKeyDown(dirCfg) {
        dirBase.call(this, dirCfg);
        this.priority = 3;
        this.context = root;
        return this;
    }

    RKeyDown.prototype = {

        "constructor": RKeyDown,

        "link": function (el, exp, scope, context) {
            //  修正scope
            this.scope = this.scope || scope;
            Event.removeEvent(el, "keydown", exp);
            Event.addEvent(el, "keydown", exp);
        }

    };

    return {
        "name": "RKeyDown",
        "type": "event",
        "priority": 3,
        "constructor": RKeyDown
    };

}));
