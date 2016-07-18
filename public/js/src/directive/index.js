/**
 * index.js
 * 指令暴露模块
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["rBind", "rClick", "rFor"], function () {
            var argus = [].slice.call(arguments);
            return factory.apply(root, argus);
        });
    }

}(window, function () {

    var exportObj = {},
        argu = [].slice.call(arguments);

    argu.forEach(function (item) {
        exportObj[item["name"]] = item["constructor"];
    });

    return exportObj;

}));
