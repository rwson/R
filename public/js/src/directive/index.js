/**
 * index.js
 * 指令暴露模块
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["rBind", "rClick", "rFor", "rModel", "rKeyUp"], function () {
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
    });

    return exportObj;

}));

/***

 priorityMap, the execute query order of directives

 其中,控制

 this.priority = 0;
 {
    {
        "r-controller": {
            "priority": 0
        },
        "r-for": {
            "priority": 1
        },
        "r-if": {
            "priority": 1
        },
        "r-show": {
            "priority": 1
        },
        "r-hide": {
            "priority": 1
        },
        "r-show": {
            "priority": 1
        },
        "r-keyup": {
            "priority": 2
        },
        "r-click": {
            "priority": 2
        }
    }
 }

 */

