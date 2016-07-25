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
        "RHref": "src/directive/r-href",
        "rFor": "src/directive/r-for",
        "rModel": "src/directive/r-model",
        "rKeyUp": "src/directive/r-keyup",
        "rKeyDown": "src/directive/r-keydown",
        "rIf": "src/directive/r-if",
        "rElse": "src/directive/r-else",
        "rShow": "src/directive/r-show",
        "rHide": "src/directive/r-hide",

        "dirBase": "src/directive/direcrive-base",
        "directive": "src/directive/index",
        "scope": "src/scope/index",
        "compile": "src/compile/index",
        "r": "src/r/index",

        "app": "app"
    }
});
