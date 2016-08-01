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
        dirCfg.name = "RKeyUp";
        dirBase.call(this, dirCfg);
        this.context = root;
        return this;
    }

    RKeyUp.prototype = {

        "constructor": RKeyUp,

        "link": function (el, exp, scope, context) {
            this.bindFn = this.scope.execDeep(this.finalExp, this.scope.events).result;
            if (Tool.isType(this.bindFn, "function")) {
                Event.removeEvent(el, "keyup", this.bindFn.bind(context));
                Event.addEvent(el, "keyup", this.bindFn.bind(context));
            }
        }

    };

    return {
        "name": "RKeyUp",
        "type": "event",
        "constructor": RKeyUp
    };

}));
