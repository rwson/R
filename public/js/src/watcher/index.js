/**
 * Watcher类,实现一个数据的监听
 */

"use strict";

import * as Tool from "../lib/Tool";

let watcherList = [];

class Watcher {

    constructor() {
    }

    /**
     * 模拟WatcherList Setter
     * @param watchers
     */
    static setWatchers(watchers) {
        watcherList = watchers;
    }

    static setAsEmpty() {
        watcherList = [];
    }

    /**
     * 模拟WatcherList Setter
     * @return Array.<T>
     */
    static getWatchers() {
        return watcherList;
    }

    /**
     * 添加相关属性的订阅监听
     * @param keys  Array.<Object>
     * @param scope Scope类的实例
     */
    static subscribe(keys, scope) {
        keys.forEach((watcher) => {
            watcher.scope = scope;
            watcherList.push(watcher);
        });
    }

    /**
     * 取消对该属性的订阅
     * @param uIds  Array.<uId>
     */
    static unSubscribe(uIds) {
        if (!Tool.isType(uIds, "array")) {
            uIds = [uIds];
        }
        watcherList = watcherList.filter((watcher) => {
            return !(~(uIds.indexOf(watcher.uId)));
        });
    }

}

export default Watcher;
