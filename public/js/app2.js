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

    R.controller("appCtrl", function (scope) {
    });
    R.inject("appCtrl", "shareData");


    R.controller("appCtrl2", function (scope) {
    });
    R.inject("appCtrl2", "shareData");

    R.bootstrap("#app");

});
