/**
 * App主入口
 */

"use strict";

define("app", ["routable", "config"], function (routable, config) {

    routable.config(config);
    routable.run();

});
