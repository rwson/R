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
            watcher.calledUpdate = false;
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

    /**
     * 通知方法
     * @param   uIds   scope对应的uId
     * @param callback 回调函数
     */
    static notify(uIds, callback) {
        watcherList.forEach((watcher) => {
            if(!watcher.calledUpdate && !(~uIds.indexOf(watcher.uId)) && Tool.isType(callback, "Function")) {
                watcher.calledUpdate = true;
                callback(watcher);
                watcher.calledUpdate = false;
            }
        });
    }

}

export default Watcher;
