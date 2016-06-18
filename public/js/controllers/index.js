/**
 * 首页控制器
 */

"use strict";

define(["routable"], function (routable) {

    function indexCtrl() {

        routable.setData({
            "classTest": true,
            "showPic": 1
        }, true);

        routable.assignEvents({
            "testFn": function () {
                alert("我日了狗!!!");
            }
        });

        setTimeout(function () {
            routable.setData({
                "classTest": true
            });
        }, 10000);

    }

    return indexCtrl;

});
