/**
 * App主入口
 */

"use strict";

R.provider("testProvider", function () {
    return {
        "name": "小宋",
        "age": 24
    };
});

//  首页控制器
R.controller("indexCtrl", function (scope, pageParams, testProvider) {

    scope.set({
        "text": "" + ((+new Date()) + Math.random()),
        "name": "",
        "checked": true,
        "showFlag": true,
        "list": []
    });

    scope.defineEVENTs({
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
R.inject("indexCtrl", ["pageParams", "testProvider", "testProvider"]);

//  列表页控制器
R.controller("listCtrl", function (scope, pageParams) {

    console.log(pageParams);
    scope.set({
        "list": [],
        "showFlag": false
    });

    _request("/list/articles", function (res) {
        if (res.status) {
            scope.update({
                "list": res.data,
                "showFlag": true
            });
        }
    }, function (ex) {

    });
});
R.inject("listCtrl", ["pageParams"]);

//  详情页控制器
R.controller("detailCtrl", function (scope, pageParams) {

    console.log(pageParams);

    scope.set({
        "title": "",
        "content": ""
    });
    _request("/detail/content", function (res) {
        if (res.status) {
            scope.update(res.data);
        }
    }, function (ex) {
    });
});
R.inject("detailCtrl", ["pageParams"]);

var routeConfig = {
    "path": {
        "/": {
            "tplPath": "/tpl/index.html",
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
    "pushState": false
};

R.config(routeConfig);

R.bootstrap("#app", true);

/**
 * 发起get请求
 * @param url       请求路径
 * @param success   成功回调
 * @param error     失败回调
 * @private
 */
function _request(url, success, error) {
    var xhr = new XMLHttpRequest(),
        res;

    xhr.withCredentials = true;
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(null);
    xhr.onreadystatechange = function () {

        try {
            res = JSON.parse(xhr.response);
        } catch (ex) {
            res = eval(xhr.response);
        }

        if (xhr.readyState === 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                success(res);
            } else {
                error(xhr);
            }
        }
    };
}
