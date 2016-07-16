/**
 * r-for指令
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["../lib/Tool"], function (Tool) {
            return factory(root, Tool);
        });
    } else {
        root.RFor = RFor;
    }

}(window, function (root, Tool, undefined) {

    function RFor() {
    }

    return {
        "name": "RFor",
        "constructor": RFor
    };

}));
