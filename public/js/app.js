/**
 * App主入口
 */

"use strict";

define("app", ["r"], function (R) {

    R.controller("app", function (scope) {

        scope.set({
            "text": "我是文本",
            "list": [
                {
                    "title": "title",
                    "link": "http://xxx.com"
                },
                {
                    "title": "title2",
                    "link": "http://xxx.com"
                },
                {
                    "title": "title3",
                    "link": "http://xxx.com"
                },
                {
                    "title": "title4",
                    "link": "http://xxx.com"
                }
            ]
        });

        scope.defineEvents({
            "clickCallback":function() {
                alert("点我干啥");
                scope.update({
                    "text": "我是改变后的文本"
                });
            }
        });

    });

    R.inject("app", ["timeout"]);

    R.bootstrap("#app");

});
