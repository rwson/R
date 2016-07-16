/**
 * RouteAble前端路由
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([
            "./lib/Tool",
            "./lib/DOM",
            "./lib/Event"
        ], function (Tool, Dom, Event) {
            return factory(window, Tool, Dom, Event);
        });
    }
}(window, function (root, Tool, Dom, Event, undefined) {

    var R = {
        "params": {
            "routeParams": {},
            "urlQueryString": {}
        },
        "default": {
            "pushState": true,
            "defaultRoute": "/"
        }
    };

    return R;

}));
