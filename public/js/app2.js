/**
 * App主入口
 */

"use strict";

define("app2", ["r"], function (R) {

    R.service("shareData", function () {
        return {
            "fullname": "share full name"
        };
    });

    R.service("shareTodos", function () {
        return {
            "todos": []
        };
    });

    //  自定义指令r-text
    R.directive("RText", {
        "extend": true,
        "type": "dom",
        "priority": 1,
        "constructor": function (dirCfg) {
        },
        "link": function (el, exp, scope) {
            if (typeof exp !== "undefined") {
                el.textContent = exp;
            }
        },
        "update": function (el, exp, scope) {
            this.el.textContent = exp;
        }
    });

    R.controller("appCtrl", function (scope, shareData, shareTodos) {

        scope.set({
            "todo": "",
            "str": "test",
            "text": "test custom directive"
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


    R.controller("appCtrl2", function (scope, shareData, shareTodos, http) {

        scope.set({
            "class": true,
            "css": false
        });

        scope.defineEvents({
            "changeClass": function() {
                scope.update({
                    "class": !scope.get("class"),
                    "css": !scope.get("css")
                });
            }
        });

        http({
            "url": "/test/ajax/provider",
            "type": "GET",
            "data": {
                "name": "rwson"
            },
            "success": function (res) {
                console.log(JSON.parse(res));
            },
            "error": function (ex) {
            }
        });
    });
    R.inject("appCtrl2", "shareData", "shareTodos", "http");

    R.bootstrap("#app");

});
