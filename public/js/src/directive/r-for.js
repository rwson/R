/**
 * r-for指令
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["tool"], function (Tool) {
            return factory(root, Tool);
        });
    }

}(window, function (root, Tool, undefined) {

    function RFor(dirCfg) {
        this.el = dirCfg.el;
        this.scope = dirCfg.scope;
        this.exp = dirCfg.directives[0].exp;
        return this;
    }

    return {
        "name": "RFor",
        "constructor": RFor
    };

}));
