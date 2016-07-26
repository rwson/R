/**
 * r-show指令
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
    }

    RShow.prototype = {

        "constructor": RShow,

        "link": function (el, exp, scope) {
            this.scope = this.scope || scope;

            if(exp) {
                el.style.display = "block";
            } else {
                el.style.display = "none";
            }
        },

        "update": function (exp) {
            if(exp) {
                this.el.style.display = "block";
            } else {
                this.el.style.display = "none";
            }
        }

    };

    return {
        "name": "RShow",
        "type": "control",
        "constructor": RShow
    };

}));


