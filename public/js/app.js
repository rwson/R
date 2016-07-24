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
            "showFlag": true,
            "list": []
        });

        scope.defineEvents({
            "clickCallback": function () {
                scope.update({
                    "showFlag": !scope.get("showFlag"),
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

    R.controller("indexCtrl", function (scope) {
        alert("indexCtrl");
    });

    R.controller("listCtrl", function (scope) {
        alert("listCtrl");
    });

    R.controller("detailCtrl", function (scope) {
        alert("detailCtrl");
    });

    var routeConfig = {
        "path": {
            "/": {
                "tplPath": "/tpl/index2.html",
                "controller": "indexCtrl"
            },
            "/list": {
                "tplPath": "/tpl/list.html",
                "controller": "listCtrl"
            },
            "/list/:page": {
                "tplPath": "/tpl/list.html",
                "controller": "listCtrl"
            },
            "/detail": {
                "tplPath": "/tpl/detail.html",
                "controller": "detailCtrl"
            },
            "/detail/:id": {
                "tplPath": "/tpl/detail.html",
                "controller": "detailCtrl"
            }
        },
        "pushState": true
    };

    R.config(routeConfig);

    R.bootstrap("#app");

});
