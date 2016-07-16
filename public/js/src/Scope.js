"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["./lib/Tool"], function (Tool) {
            return factory(window, Tool);
        });
    } else {

    }

}(window, function (root, Tool, undefined) {



}));
