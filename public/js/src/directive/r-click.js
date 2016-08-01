/**
 * r-click指令
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["tool", "event", "dom", "dirBase"], function (Tool, Event, Dom, dirBase) {
            return factory(root, Tool, Event, Dom, dirBase);
        });
    }

}(window, function (root, Tool, Event, Dom, dirBase, undefined) {

    function RClick(dirCfg) {
        dirCfg.name = "RClick";
        dirBase.call(this, dirCfg);
        return this;
    }

    RClick.prototype = {

        "constructor": RClick,

        "link": function (el, exp, scope, context) {
            this.bindFn = this.scope.execDeep(this.finalExp, this.scope.events).result;
            if (Tool.isType(this.bindFn, "function")) {
                Event.removeEvent(el, "click", this.bindFn);
                Event.addEvent(el, "click", this.bindFn.bind(context));
            }
        }
    };

    return {
        "name": "RClick",
        "type": "event",
        "constructor": RClick
    };

}));
