/**
 * 首页控制器
 */

"use strict";

define(["routable"], function (routable) {

    function indexCtrl() {

        routable.setData({
            "classTest": true
        },true);

        routable.assignEvents({
            "testFn": function () {
                alert("我日了狗!!!");
            }
        });
    }

    return indexCtrl;

});
