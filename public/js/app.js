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
                    "title": "todo1",
                    "id": "" + ((+new Date()) + Math.random())
                }
            ]
        });

        scope.defineEvents({
            "clickCallback": function () {
                scope.update({
                    "text": "" + ((+new Date()) + Math.random())
                });
            },
            "addTodo": function (ev) {
                var keyCode = ev.keyCode;
                var title = ev.target.value.trim();
                var list = scope.get("list");
                if (keyCode === 13) {
                    if (!title) {
                        alert("请先填写标题!");
                        return;
                    }
                    list.push({
                        "title": title,
                        "id": "" + ((+new Date()) + Math.random())
                    });
                    scope.update({
                        "list": list
                    });
                    ev.target.value = "";
                }
            }
        });

    });

    R.inject("app", ["timeout"]);

    R.bootstrap("#app");

});
