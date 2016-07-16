/**
 * r-click指令
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["../lib/Tool"], function (Tool) {
            return factory(root, Tool);
        });
    } else {
        root.RClick = RClick;
    }

}(window, function (root, Tool, undefined) {

    function RClick() {
    }

    return {
        "name": "RClick",
        "constructor": RClick
    };

}));
