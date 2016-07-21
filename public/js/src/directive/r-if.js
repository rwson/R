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

    function RIf(dirCfg) {
        dirBase.call(this,dirCfg);
        this.priority = 1;
    }

    RIf.prototype = {

        "constructor": RIf,

        "link": function(el, exp, scope) {
        },

        "update": function(exp) {

        }

    };

    return {
        "name": "RIf",
        "type": "control",
        "priority": 1,
        "constructor": RIf
    };

}));


