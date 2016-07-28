/**
 * App主入口
 */

"use strict";

define("app2", ["r"], function (R) {

    R.service("shareData", function () {
        return {
            "fullname": "lalala"
        };
    });

    R.service("shareTodos", function () {
        return {
            "todos": []
        };
    });

    R.controller("appCtrl", function (scope, shareData, shareTodos) {

        scope.set({
            "todo": ""
        });

        scope.defineEvents({
            "addTodo": function (ev) {
                var target = ev.target;
                var val = target.value.trim();
                var todos = scope.get("todos");
                if (val) {
                    todos.push({
                        "title": val
                    });
                    scope.update({
                        "todos": todos
                    });
                }
            },
            "keyUp": function (ev) {
                var todos = scope.get("todos");
                var target = ev.target;
                if (ev.keyCode == 13 && scope.get("todo")) {
                    todos.push({
                        "title": scope.get("todo")
                    });
                    scope.update({
                        "todos": todos
                    });
                    target.value = "";
                }
            }
        });
    });
    R.inject("appCtrl", "shareData", "shareTodos");


    R.controller("appCtrl2", function (scope, shareData, shareTodos) {
    });
    R.inject("appCtrl2", "shareData", "shareTodos");

    R.bootstrap("#app");

});
