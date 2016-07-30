/**
 * Diff.js
 * 返回两个list中不同的项
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["tool"], function (Tool) {
            return factory(window, Tool);
        });
    }

}(window, function (root, Tool, undefined) {

    var Diff = {
        "compare": function (list1, list2, keys) {
            var list1Len = list1.length,
                list2Len = list2.length,
                append = [],
                res = [],
                list1Compare, list2Compare;

            //  长度不相等时的判断
            if (list2Len > list1Len) {
                append = list2.slice(list2Len - list1Len);
            } else if (list1Len > list2Len) {
                list2 = list2.slice(0, list2Len);
            }

            list1Compare = this.makeListByKey(list1, keys);
            list2Compare = this.makeListByKey(list2, keys);

            //  存在新增元素
            if (append.length) {
                append = append.map(function (item) {
                    return {
                        "type": "append",
                        "value": item
                    };
                });
            }
            return res.concat(append);
        },
        "makeListByKey": function (list, keys) {
            var tmp;
            return list.map(function (item) {
                tmp = item;
                if (keys && keys.length) {
                    tmp = {};
                    Object.keys(item).forEach(function (key) {
                        if (!!(~(keys.indexOf(key)))) {
                            tmp[key] = item[key];
                        }
                    });
                }
                return tmp;
            });
        }
    };

    return Diff;

}));
