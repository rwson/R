/**
 * r-controller获取
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["tool"], function (Tool) {
            return factory(root, Tool);
        });
    } else {
        root.RClick = RClick;
    }

}(window, function (root, Tool, undefined) {

    function RController() {
        return this;
    }

    return {
        "name": "RController",
        "constructor": RController
    };

}));
