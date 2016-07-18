/**
 * r-bind指令
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["tool"], function (Tool) {
            return factory(root, Tool);
        });
    }

}(window, function (root, Tool, undefined) {

    function RBind(dirCfg) {
        this.el = dirCfg.el;
        this.scope = dirCfg.scope;
        this.exp = dirCfg.directives[0].exp;
        return this;
    }

    RBind.prototype = {

        "constructor": RBind,

        "link": function (el, exp, scope) {
            //  修正scope
            this.scope = this.scope || scope;
            el.innerHTML = exp;
        }

    };

    return {
        "name": "RBind",
        "constructor": RBind
    };

}));


