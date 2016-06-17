/**
 * 首页控制器
 */

"use strict";

define(["routable"], function (routable) {

    function indexCtrl() {

        console.log("我是首页");

        routable.setData({
            "data": "original data"
        });

    }

    return indexCtrl;

});
