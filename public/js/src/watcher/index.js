/**
 * index.js
 * build by rwson @7/18/16
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

    /**
     * 观察者构造器
     * @param value
     * @constructor
     */
    function Obverser(value) {
        this.value = value;
        this.deep = new _Deep();
        walk(value);
    }

    /**
     * 深度监听对象
     * @constructor
     * @private
     */
    function _Deep() {
        this.uId = Tool.randomStr();
        this.target = null;
        this._listeners = [];
    }

    /**
     * 递归指定
     * @param value
     * @private
     */
    function _walk(value) {
        Object.keys(value).forEach(function (key) {

        });
    }

    return Obverser;

}));
