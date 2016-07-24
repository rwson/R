/**
 * RouteAble前端路由
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([
            "tool",
            "dom",
            "event",
            "compile",
            "scope"
        ], function (Tool, Dom, Event, Compile, Scope) {
            return factory(window, Tool, Dom, Event, Compile, Scope);
        });
    }
}(window, function (root, Tool, Dom, Event, Compile, Scope, undefined) {

    var _controllerSuffix = "CONTROLLER_";      //  Controller前缀
    var _directiveSuffix = "DIRECTIVE_";        //  Directive前缀
    var _serviceSuffix = "SERVICE_";            //  Service前缀

    var paramRoute = /(\/\:\w+)+/g;             //  带url参数REST风格的路由
    var replaceParam = /(\/\:\w+)/g;            //  替换掉url中参数的表示
    var urlQueryStr = /\?[\S=\S]+/g;            //  url中带有queryString

    /**
     * 暂存列表
     * @type {{controllers: {}, directives: {}, service: {}}}
     * @private
     */
    var _store = {
        "controllers": {},
        "directives": {},
        "service": {}
    };

    var R = {

        //  默认配置
        "cfg": {
            "path": {},         //  Object,由path("/","/list"...)做key,value对应一个Object,包含tplPath,controller两个属性
            "pushState": true,      //  是否支持HTML5的pushState,传入false,即采用hash解决方案
            "default": "/"          //  首页
        },

        //  最后的配置参数
        "finalCfg": {},

        //  url中所带参数,包含queryString和path
        "pageParams": {},

        "_compile": null,

        "configs": {},

        "controller": function (name, fn) {
            _store.controllers[_controllerSuffix + name] = {
                "scope": Scope,
                "fn": fn
            };
        },

        "directive": function (name, fn) {
            _store.directives[_directiveSuffix + name] = fn;
        },

        "service": function (name, fn) {
            _store.service[_serviceSuffix + name] = fn;
        },

        "inject": function (name, deps) {
            this._get(name)["inject"] = deps;
        },

        "config": function (opt) {
            var finalCfg = Tool.merge(this.cfg, opt, true),         //  合并传入的参数和原来的默认配置                                           //
                cfgObj = {},                                        //  用来缓存Object方式配置路由的数据
                toMerge = {},                                       //  原来的正则表达式对象和新的属性合并
                cPath,                                              //  Object方式配置路由,会遍历每一项,cPath表示当前一项
                res,                                                //  路由带参数时匹配结果
                regex;                                              //  正则表达式对象

            //  处理div#route-app不存在的情况
            if (!this.container) {
                var body = document.getElementsByTagName("body")[0];
                var first = body.getElementsByTagName("*")[0];
                this.container = document.createElement("div");
                this.container.id = "route-app";
                body.insertBefore(this.container, first);
            }

            if (Tool.isType(finalCfg.path, "Object")) {
                //  Object形式的配置
                Object.keys(finalCfg.path).forEach(function (item) {
                    cPath = finalCfg.path[item];
                    res = ("" + item).match(paramRoute);
                    regex = new RegExp(("" + item).replace(replaceParam, "\\/\\w+"), "g");
                    toMerge = {
                        "path": item
                    };
                    if (res) {
                        toMerge = {
                            "config": item,
                            "path": regex,
                            "regex": regex
                        };
                    }
                    cfgObj[item] = Tool.merge(cPath, toMerge, true);
                });
                finalCfg.path = cfgObj;
            }
            this.finalCfg = finalCfg;
        },

        /**
         * 获取当前path在配置中的相关参数
         * @param path  当前页面的path
         * @returns {*}
         */
        "getCurrent": function (path) {
            var route = this.finalCfg.path,
                fPath = path,
                tPath, output;

            this.pageParams = {};

            //  url中存在查询字符串,将url转换成"?"前面的内容,再进行比对
            if (fPath.match(urlQueryStr)) {
                this.pageParams.queryString = Tool.getQueryString(fPath);
                fPath = fPath.split("?")[0];
            }
            if (Tool.isType(route, "Object")) {
                Object.keys(route).forEach(function (item) {
                    tPath = route[item]["path"];
                    if (Tool.isType(tPath, "String")) {
                        output = route[item];
                    } else if (Tool.isType(tPath, "Regexp") && tPath.test(fPath)) {
                        output = Tool.merge(route[item], {
                            "path": fPath
                        }, true);
                    }
                });
                output = route[path];
            } else if (Tool.isType(route, "Array")) {
                route.forEach(function (item) {
                    tPath = item["path"];
                    if (Tool.isType(tPath, "String") && tPath === fPath) {
                        output = item;
                    } else if (Tool.isType(tPath, "RegExp") && tPath.test(fPath)) {
                        output = Tool.merge(item, {
                            "path": fPath
                        }, true);
                    }
                });
            }
            //  url中带参数配置项
            if (output.regex) {
                var urlSplits = fPath.split("/");
                var cfgSplits = output.config.split("/");
                cfgSplits.forEach(function (item, index) {
                    if (("" + item).indexOf(":") > -1) {
                        if (!this.pageParams.path) {
                            this.pageParams.path = {};
                        }
                        this.pageParams.path[("" + item).replace(":", "")] = urlSplits[index];
                    }
                }, this);
            }
            return output;
        },

        "go": function () {

        },

        "bootstrap": function (el) {

            var hashOrState = Tool.getHashOrState("/"),
                path = hashOrState.path || hashOrState.hash,
                cfgCtrlObj = this.getCurrent(path),
                context = document.querySelector(el),
                ctrlEle = null,
                cfgCtrlName = cfgCtrlObj.controller,
                tplPath = cfgCtrlObj.tplPath,
                ctrlName, finalCtrl;

            ctrlEle = Dom.getCtrlElement(ctrlName, context);

            finalCtrl = _store.controllers[_controllerSuffix + cfgCtrlName];
            this._compile = new Compile(ctrlEle);
            var Scope = new finalCtrl.scope(this._compile);
            finalCtrl.fn(Scope);
            Scope.link(ctrlEle);

            Object.keys(_store.controllers).forEach(function (key) {
                ctrlName = key.replace(_controllerSuffix, "");
                if (cfgCtrlName === cfgCtrlName) {

                    console.log(cfgCtrlName);

                    this._compile = new Compile(ctrlEle);
                    var CtrlObj = _store.controllers[key];
                    var Scope = new CtrlObj.scope(this._compile);
                    //CtrlObj.fn(Scope);
                    //Scope.link(ctrlEle);
                    //_store.controllers[key].fn(Scope);
                }
            }, this);
        },

        "_get": function (name) {
            return _store.controllers[_controllerSuffix + name] || _store.directives[_directiveSuffix + name];
        }

    };

    return R;

}));
