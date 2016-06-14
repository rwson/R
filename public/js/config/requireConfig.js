/**
 * requirejs相关配置
 */
"use strict";
require.config({
    baseUrl: "/js/",
    paths: {
        "routable": "src/index",
        "config": "config/config",
        "index": "controllers/index",
        "list": "controllers/list",
        "detail": "controllers/detail",
        "app": "app"
    }
});
