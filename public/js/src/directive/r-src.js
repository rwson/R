/**
 * r-src指令
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["tool", "event", "dirBase"], function (Tool, Event, dirBase) {
            return factory(root, Tool, Event, dirBase);
        });
    }

}(window, function (root, Tool, Event, dirBase, undefined) {

    function RSrc(dirCfg) {
        dirCfg.name = "RSrc";
        dirBase.call(this, dirCfg);
    }

    RSrc.prototype = {

        "constructor": RSrc,

        "link": function (el, exp, scope) {

        },

        "update": function (exp) {
        }

    };

    return {
        "name": "RSrc",
        "type": "control",
        "constructor": RSrc
    };

}));


