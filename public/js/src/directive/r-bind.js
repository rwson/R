/**
 * r-bind指令
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["tool", "dirBase"], function (Tool, dirBase) {
            return factory(root, Tool, dirBase);
        });
    }

}(window, function (root, Tool, dirBase, undefined) {

    function RBind(dirCfg) {
        dirBase.call(this, dirCfg);
        this.priority = 2;
        return this;
    }

    RBind.prototype = {

        "constructor": RBind,

        "link": function (el, exp, scope) {
            //  修正scope
            this.scope = this.scope || scope;
            if(!Tool.isUndefined(exp)) {
                el.innerHTML = exp;
            }
        },

        "update": function(exp) {
            this.el.innerHTML = exp;
        }

    };

    return {
        "name": "RBind",
        "type": "content",
        "priority": 4,
        "constructor": RBind
    };

}));


