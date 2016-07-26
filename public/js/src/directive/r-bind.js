/**
 * r-bind指令
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["tool", "dom", "dirBase"], function (Tool, Dom, dirBase) {
            return factory(root, Tool, Dom, dirBase);
        });
    }

}(window, function (root, Tool, Dom, dirBase, undefined) {

    function RBind(dirCfg) {
        dirBase.call(this, dirCfg);
        return this;
    }

    RBind.prototype = {

        "constructor": RBind,

        "link": function (el, exp, scope) {
            //  修正scope
            this.scope = this.scope || scope;
            if (!Tool.isUndefined(exp)) {
                el.innerHTML = exp;
            }
        },

        "update": function (exp) {
            this.el.innerHTML = exp;
        }

    };

    return {
        "name": "RBind",
        "type": "content",
        "constructor": RBind
    };

}));


