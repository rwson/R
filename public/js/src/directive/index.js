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
            "extend": true,
            "dirType": "dom",
            "priority": 0
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
                    dirCfg.name = name;
                    dirBase.call(this, dirCfg);
                }

                Tool.isType(opt.constructor, "function") && opt.constructor.call(this, dirCfg);
                this.priority = opt.priority;
                this.dirType = opt.type;

                this.link = function () {
                    var execRes;
                    if (this.dirType === "dom") {
                        execRes = this.scope.execDeep(this.finalExp, this.scope.data);
                        this.originalData = execRes.result;
                        this.updateExp = execRes.executeStr;
                        opt.link(this.el, this.originalData, this.scope);
                    } else if (this.dirType === "events") {
                        execRes = this.scope.execDeep(this.finalExp, this.scope.events);
                        this.bindFn = execRes.result;
                        opt.link(this.el, this.bindFn, this.scope);
                    }
                };

                this.update = function () {
                    var newVal = this.scope.execByStr(this.updateExp, this.scope.data);
                    if (!Tool.isEqual(newVal, this.originalData)) {
                        if (Tool.isType(opt.update, "function")) {
                            opt.update.call(this, this.el, newVal, this.scope);
                        }
                        this.originalData = newVal;
                    }
                };
            }
        };
    };

    return exportObj;

}));

