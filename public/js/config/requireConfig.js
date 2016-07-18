/**
 * requirejs相关配置
 */

"use strict";

require.config({
    baseUrl: "/js/",
    paths: {
        "index": "src/index",
        "tool": "src/lib/Tool",
        "event": "src/lib/Event",
        "dom": "src/lib/DOM",
        "rClick": "src/directive/r-click",
        "rBind": "src/directive/r-bind",
        "rFor": "src/directive/r-for",
        "directive": "src/directive/index",
        "scope": "src/scope/index",
        "compile": "src/compile/index",
        "r": "src/r/index",
        "app": "app"
    }
});

requirejs.onError = function (err) {
    console.log(err);
};
