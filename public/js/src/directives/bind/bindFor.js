/**
 * bindFor.js
 * bind-for指令
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["../libs/TOOL"], function (_Tool) {
            return factory(window, _Tool);
        });
    } else {
        root.bindFor = factory(window, Tool);
    }

}(window, function (root, _Tool, undefined) {


    function binfFor() {
    }

}));
