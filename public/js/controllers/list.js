/**
 * 列表也控制器
 */

"use strict";

define(["routable"], function (routable) {

    function listCtrl() {
        console.log(routable.pageParams);
        console.log("我是列表页");
    }

    return listCtrl;

});

