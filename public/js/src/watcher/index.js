/**
 * Watcher类,实现一个数据的监听
 */

"use strict";

import * as Tool from "../lib/Tool";

class Watcher {

    constructor() {
        this.watcherList = [];
    }

    static getList() {
        return this.watcherList;
    }

    /**
     * 添加相关属性的订阅监听
     * @param keys  Array.<Object>
     * @param scope Scope类的实例
     */
    static subscribe(keys, scope) {
        let watcherList = this.watcherList;
        keys.forEach((watcher) => {
            watcher.scope = scope;
            watcherList.push(watcher);
        });
        this.watcherList = watcherList;
    }

    /**
     * 取消对该属性的订阅
     * @param uIds  Array.<uId>
     */
    static unSubscribe(uIds) {
        let watcherList = this.watcherList;
        if (!Tool.isType(uIds, "array")) {
            uIds = [uIds];
        }
        this.watcherList = watcherList.filter((watcher) => {
            return !(~(uIds.indexOf(watcher.uId)));
        });
    }

}

export default Watcher;
