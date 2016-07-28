/**
 * index.js
 * 指令暴露模块
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([
            "tool",
            "dirBase",
            "rBind",
            "RHref",
            "rClick",
            "rFor",
            "rModel",
            "rKeyUp",
            "rKeyDown",
            "rIf",
            "rElse",
            "rShow",
            "rHide"
        ], function (Tool, dirBase) {
            var argus = [].slice.call(arguments, 2);
            argus.unshift(Tool, dirBase);
            return factory.apply(window, argus);
        });
    }

}(window, function (Tool, dirBase) {

    var exportObj = {},
        customOpt = {
            "extend": true
        },
        argus = [].slice.call(arguments, 2);

    //  配置暴露对象
    argus.forEach(function (item) {
        exportObj[item["name"]] = item["constructor"];
        exportObj[item["name"]]["dirType"] = item["type"];
    });

    /**
     * 自定义指令
     * @param name  指令名称(驼峰命名)
     * @param opt   参数选项
     */
    exportObj.extend = function (name, opt) {
        opt = Tool.merge(customOpt, opt, true);
        exportObj[name] = {
            "constructor": function (dirCfg) {
                if (opt.extend) {
                    dirBase.call(this, dirCfg);
                }
                Tool.isType(opt.constructor, "function") && opt.constructor.call(this, dirCfg);
                this.priority = opt.priority || 0;
                this.dirType = opt.type;
                this.link = opt.link;
                this.update = opt.update;
            }
        };
    };

    return exportObj;

}));

