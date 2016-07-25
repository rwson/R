/**
 * index.js
 * 指令暴露模块
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([
            "rBind",
            "RHref",
            "rClick",
            "rFor",
            "rModel",
            "rKeyUp",
            "rKeyDown",
            "rIf",
            "rElse",
            "rShow",
            "rHide"
        ], function () {
            var argus = [].slice.call(arguments);
            return factory.apply(root, argus);
        });
    }

}(window, function () {

    var exportObj = {},
        argu = [].slice.call(arguments);

    //  配置暴露对象
    argu.forEach(function (item) {
        exportObj[item["name"]] = item["constructor"];
        exportObj[item["name"]]["priority"] = item["priority"];
        exportObj[item["name"]]["dirType"] = item["type"];
    });

    return exportObj;

}));

