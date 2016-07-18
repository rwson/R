/**
 * index.js
 * scope类,指定作用域
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["tool"], function (Tool) {
            return factory(root, Tool);
        });
    } else {
        root.RFor = RFor;
    }

}(window, function (root, Tool, undefined) {

    /**
     * Controller对应的scope对象
     * @param compile   编译方法
     * @constructor
     */
    function Scope(compile) {
        this.uId = Tool.randomStr();
        this.compile = compile;
        this.data = {};
        this.events = {};
    }

    Scope.prototype = {

        "constructor": Scope,

        "set": function (obj) {
            this.data = Tool.transfer(Tool.merge(this.data || {}, obj, true), {
                "context": this.compile,
                "beforeUpdate": this.compile.beforeUpdate,
                "update": this.compile.update
            });

            Object.keys(this.data).forEach(function (key) {
                this.data[key] = obj[key];
            }.bind(this));
        },

        "get": function (key) {
            return this.data[key];
        },

        "update": function (obj) {
            Object.keys(obj).forEach(function (key) {
                this.data[key] = obj[key];
            }.bind(this));
        },

        "remove": function (key) {
        },

        "defineEvents": function (obj) {
            this.events = Tool.copy(obj, true);
        },

        "exec": function (exp) {
            return this.data[exp] || this.events[exp];
        },

        "link": function () {
            this.compile.link(this);
        }

    };

    return Scope;

}));
