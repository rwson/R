/**
 * 指令优先级配置
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["tool"], function (Tool, dirBase) {
            return factory(root, Tool, dirBase);
        });
    }

}(window, function (root, Tool, dirBase, undefined) {

    return {
        "RClick": {
            "priority": 3
        },
        "RElse": {
            "priority": 1
        },
        "RBind": {
            "priority": 4
        }
    };

}));


