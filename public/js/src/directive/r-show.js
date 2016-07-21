/**
 * r-if指令
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["tool", "event", "dirBase"], function (Tool, Event, dirBase) {
            return factory(root, Tool, Event, dirBase);
        });
    }

}(window, function (root, Tool, Event, dirBase, undefined) {

    function RShow(dirCfg) {
        dirBase.call(this, dirCfg);
        this.priority = 1;
    }

    RShow.prototype = {

        "constructor": RShow,

        "link": function (el, exp, scope) {
            this.scope = this.scope || scope;

        },

        "update": function (exp) {

        }

    };

    return {
        "name": "RShow",
        "type": "control",
        "priority": 1,
        "constructor": RShow
    };

}));


