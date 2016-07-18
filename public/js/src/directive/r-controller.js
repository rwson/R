/**
 * r-controller获取
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["tool"], function (Tool) {
            return factory(root, Tool);
        });
    }

}(window, function (root, Tool, undefined) {

    function RController(dirCfg) {
        this.el = dirCfg.el;
        this.scope = dirCfg.scope;
        this.exp = dirCfg.directives[0].exp;
        return this;
    }

    return {
        "name": "RController",
        "constructor": RController
    };

}));
