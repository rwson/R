/**
 * 首页控制器
 */

"use strict";

define(["routable"], function (routable) {

    function indexCtrl() {

        routable.setData({
            "classTest": true,
            "className": "test-class",
            "showPic": 1
        });

        routable.assignEvents({
            "testFn": function () {
                alert("我日了狗!!!");
            }
        });

        setTimeout(function () {
            routable.setData({
                "classTest": false,
                "className": "test-class2"
            }, true);
        }, 700);

    }

    return indexCtrl;

});
