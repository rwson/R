/**
 * App主入口
 */

"use strict";

define("app", ["r"], function (R) {

    R.controller("app", function (scope) {

        scope.set({
            "text": "" + ((+new Date()) + Math.random()),
            "name": "",
            "checked": true,
            "list": []
        });

        scope.defineEvents({
            "clickCallback": function () {
                scope.update({
                    "text": "" + ((+new Date()) + Math.random())
                });
            },
            /**
             * 添加todo
             * @param ev
             */
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
            },
            /**
             * 删除指定id
             */
            "deleteTodo": function () {
                var id = this.id;
                var list = scope.get("list");
                scope.update({
                    "list": list.filter(function (item) {
                        return item.id !== id;
                    })
                });
            }
        });

    });

    R.controller("app2", function (scope) {
        scope.set({
            "text": "" + ((+new Date()) + Math.random()),
            "name": ""
        });

        scope.defineEvents({
            "clickCallback": function () {
                scope.update({
                    "text": "" + ((+new Date()) + Math.random())
                });
            }
        });

    });

    R.bootstrap("#app");

});
