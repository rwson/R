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
     * 写成一个静态类,方便可以在内部进行调用而不用实例化
     */
    var Watcher = {

        /**
         * 监听数组
         */
        "watcherList": [],

        /**
         * 添加相关属性的订阅监听
         * @param keys  Array.<Object>
         * @param scope Scope类的实例
         */
        "subscribe": function (keys, scope) {
            keys.forEach(function (watcher) {
                watcher.scope = scope;
                this.watcherList.push(watcher);
            }, this);
        },

        /**
         * 取消对该属性的订阅
         * @param uIds  Array.<uId>
         */
        "unSubscribe": function (uIds) {
            if (!Tool.isType(uIds, "array")) {
                uIds = [uIds];
            }
            this.watcherList = this.watcherList.filter(function (watcher) {
                return !(~(uIds.indexOf(watcher.uId)));
            });
            if (!this.watcherList.length) {
                this.watcherList = Tool.copy(this.watcherBackup);
            }
        }
    };

    return Watcher;

}));