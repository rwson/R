/**
 * index.js
 * 编译模板
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([
            "../lib/Tool",
            "../lib/DOM"
        ], function (_Tool, _Dom) {
            return factory(window, _Tool, _Dom);
        });
    } else {
        root.bindFor = factory(window, Tool, Dom);
    }

}(window, function (root, _Tool, _Dom, directiveMap, undefined) {

    var _regMap = {
        "regText": /\{\{(.+?)\}\}/g,            //  {{a.b}}/{{a}}
        "regHtml": /\{\{\{(.+?)\}\}\}/g         //  {{{a.b}}}/{{{a}}}
    };

    //  原型相关拓展
    ComplieTemplate.prototype = {

        "constructor": ComplieTemplate

    };

    return ComplieTemplate;

}));

