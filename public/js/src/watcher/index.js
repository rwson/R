/**
 * index.js
 * Watcher类,实现一个数据的监听
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([
            "tool"
        ], function (Tool, Event) {
            return factory(window, Tool);
        });
    }
}(window, function (root, Tool, Dom) {

    /**
     * 写成一个静态类,方便可以在内部框架内部进行调用而不用实例化
     */
    var Watcher = {

        /**
         * 监听数组
         */
        "watcherList": [],

        /**
         * 重置方法
         */
        "reset": function () {
            this.watcherList = [];
        },

        /**
         * 添加相关属性的订阅监听
         * @param keys  属性(Array)
         * @param scope Scope类的实例
         */
        "subscribe": function (keys, scope) {
            var watchList = keys.map(function (watch) {
                watch.scope = scope;
                return watch;
            });
            this.watcherList = this.watcherList.concat(watchList);
        },

        /**
         * 取消对该属性的订阅
         * @param keys
         */
        "unSubscribe": function (keys) {
            if (!Tool.isType(keys, "array")) {
                keys = [keys];
            }
            this.watcherList = this.watcherList.filter(function (watcher) {
                return !(~(keys.indexOf(watcher.key)));
            });
        }
    };

    return Watcher;

}));