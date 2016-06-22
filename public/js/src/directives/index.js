/**
 * 配置
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([
            "./bind/bindFor"
        ], function (bindFor) {
            return factory(bindFor);
        });
    } else {
        root.directiveMap = factory(bindFor);
    }

}(window, function (bindFor) {

    var directiveMap = {
        "attr": {},
        "bind": {
            "bindFor": bindFor
        },
        "event": {}
    };

    return directiveMap;

}));
