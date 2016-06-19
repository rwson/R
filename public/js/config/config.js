/**
 * configs.js
 * build by rwson @6/13/16
 * mail:rw_Song@sina.com
 */

"use strict";

define(["index", "list", "detail"], function (indexCtrl, listCtrl, detailCtrl) {

    var routeConfig = {
        //"path": [
        //    {
        //        "path": "/",
        //        "tplPath": "/tpl/index.html",
        //        "controller": indexCtrl
        //    },
        //    {
        //        "path": "/list",
        //        "tplPath": "/tpl/list.html",
        //        "controller": listCtrl
        //    },
        //    {
        //        "path": "/list/:page",
        //        "tplPath": "/tpl/list.html",
        //        "controller": listCtrl
        //    },
        //    {
        //        "path": "/detail",
        //        "tplPath": "/tpl/detail.html",
        //        "controller": detailCtrl
        //    },
        //    {
        //        "path": "/detail/:id",
        //        "tplPath": "/tpl/detail.html",
        //        "controller": detailCtrl
        //    }
        //],
        "path": {
            "/": {
                "tplPath": "/tpl/index2.html",
                "controller": indexCtrl
            },
            "/list": {
                "tplPath": "/tpl/list.html",
                "controller": listCtrl
            },
            "/list/:page": {
                "tplPath": "/tpl/list.html",
                "controller": listCtrl
            },
            "/detail": {
                "tplPath": "/tpl/detail.html",
                "controller": detailCtrl
            },
            "/detail/:id": {
                "tplPath": "/tpl/detail.html",
                "controller": detailCtrl
            }
        },
        "pushState": true
    };

    return routeConfig;

});
