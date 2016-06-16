/**
 * 首页控制器
 */

"use strict";

define(["routable"], function (routable) {

    function indexCtrl() {
        console.log("我是首页");

        routable.setData({
            "oldData": "老数据"
        });

        //  setTimeout模拟异步请求
        setTimeout(function(){

            routable.setData({
                "test": 111
            });

        }, 1000);

        setTimeout(function(){

            routable.setData({
                "newData": "重新跟新的数据"
            });

        },3000);

    }

    return indexCtrl;

});
