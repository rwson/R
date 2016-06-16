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

        routable.setData({
            "test": 111
        });


        setTimeout(function(){

            routable.setData({
                "newData": "重新跟新的数据"
            });

        },3000);

    }

    return indexCtrl;

});
