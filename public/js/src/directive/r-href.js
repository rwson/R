/**
 * r-href指令
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["tool", "dom", "dirBase"], function (Tool, Dom, dirBase) {
            return factory(root, Tool, Dom, dirBase);
        });
    }

}(window, function (root, Tool, Dom, dirBase, undefined) {

    function RHref(dirCfg) {
        dirBase.call(this, dirCfg);
        return this;
    }

    RHref.prototype = {

        "constructor": RHref,

        "link": function (el, exp, scope) {
            //  修正scope
            this.scope = this.scope || scope;
            if (!Tool.isUndefined(exp)) {
                Dom.setAttributes(el, {
                    "href": exp
                });
            }
        },

        "update": function (exp) {
            Dom.setAttributes(this.el, {
                "href": exp
            });
        }

    };

    return {
        "name": "RHref",
        "type": "content",
        "constructor": RHref
    };

}));


