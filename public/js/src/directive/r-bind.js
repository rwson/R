/**
 * r-bind指令
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["../lib/Tool"], function (Tool) {
            return factory(root, Tool);
        });
    } else {
        root.RBind = RBind;
    }

}(window, function (root, Tool, undefined) {

    function RBind() {
    }

    return {
        "name": "RBind",
        "constructor": RBind
    };

}));


