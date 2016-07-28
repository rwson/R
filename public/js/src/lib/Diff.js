/**
 * Diff.js
 * build by rwson @7/28/16
 * mail:rw_Song@sina.com
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["tool"], function (Tool) {
            return factory(window, Tool);
        });
    }

}(window, function (root, Tool, undefined) {

    var Diff = {
        "compare": function (list1, list2, keys) {
        },
        "makeListByKey": function (list, keys) {
        }
    };

    return Diff;

}));
