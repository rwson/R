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

    function RHide(dirCfg) {
        dirBase.call(this,dirCfg);
    }

    RHide.prototype = {

        "constructor": RHide,

        "link": function(el, exp, scope) {

            if(exp) {
                el.style.display = "none";
            } else {
                el.style.display = "block";
            }
        },

        "update": function(exp) {

            if(exp) {
                this.el.style.display = "none";
            } else {
                this.el.style.display = "block";
            }
        }

    };

    return {
        "name": "RHide",
        "type": "control",
        "constructor": RHide
    };

}));


