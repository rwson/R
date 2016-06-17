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
        console.log(routable.data);

        var t1 = setTimeout(function () {
            clearTimeout(t1);
            routable.setData({
                "data": "new data1"
            });
            console.log(routable.data);
        }, 3000);

        var t2 = setTimeout(function () {
            clearTimeout(t2);
            routable.setData({
                "data": "new data2"
            });
            console.log(routable.data);
        }, 6000);

    }

    return indexCtrl;

});
