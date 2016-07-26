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
        dirBase.call(this, dirCfg);
        return this;
    }

    RClick.prototype = {

        "constructor": RClick,

        "link": function (el, exp, scope, context) {
            //  修正scope
            this.scope = this.scope || scope;
            if(!Tool.isUndefined(exp)) {
                Event.removeEvent(el, "click", exp);
                Event.addEvent(el, "click", exp.bind(context));
            }
        }
    };

    return {
        "name": "RClick",
        "type": "event",
        "constructor": RClick
    };

}));
