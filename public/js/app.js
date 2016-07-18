/**
 * App主入口
 */

"use strict";

define("app", ["r"], function (R) {

    R.controller("app", function (scope) {

        scope.set({
            "text": "" + ((+new Date()) + Math.random()),
            "name": "test",
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
                scope.update({
                    "text": "" + ((+new Date()) + Math.random())
                });
            }
        });

    });

    R.inject("app", ["timeout"]);

    R.bootstrap("#app");

});
