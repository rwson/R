/**
 * 详细页控制器
 */

"use strict";

define(["routable"], function (routable) {

    function detailCtrl() {
        console.log(routable.pageParams);
        console.log("我是详情页");
    }

    return detailCtrl;

});
