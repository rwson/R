/**
 * 列表也控制器
 */

"use strict";

define(["routable"], function (routable) {

    function listCtrl() {

        var params = routable.pageParams;
        var list = [
            {
                "link": "/detail",
                "title": "详情页(不带参数)"
            },
            {
                "link": "/detail/123",
                "title": "详情页(带url参数)"
            },
            {
                "link": "/detail?page=1",
                "title": "详情页(带url查询字符串)"
            },
            {
                "link": "/detail/123?page=1&location=detail",
                "title": "详情页(带url查询字符串)"
            }
        ];

        routable.setData({
            "current": params.page || 1,
            "data": list
        });

        //console.log(routable.pageParams);

        console.log("我是列表页");
    }

    return listCtrl;

});

