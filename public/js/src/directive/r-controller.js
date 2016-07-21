/**
 * r-controller获取
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["tool"], function (Tool, dirBase) {
            return factory(root, Tool, dirBase);
        });
    }

}(window, function (root, Tool, dirBase, undefined) {

    function RController(dirCfg) {
        dirBase.call(this, dirCfg);
        return this;
    }

    return {
        "name": "RController",
        "type": "dom",
        "priority": 0,
        "constructor": RController
    };

}));
