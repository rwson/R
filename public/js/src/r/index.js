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
    var _providerSuffix = "SERVICE_";           //  Provider前缀

    var paramRoute = /(\/\:\w+)+/g;             //  带url参数REST风格的路由
    var replaceParam = /(\/\:\w+)/g;            //  替换掉url中参数的表示
    var urlQueryStr = /\?[\S=\S]+/g;            //  url中带有queryString

    /**
     * 暂存列表
     * @type {{controllers: {}, directives: {}, service: {}, provider: {}}}
     * @private
     */
    var _store = {
        "controllers": {},
        "directives": {},
        "service": {},
        "provider": {}
    };


    var _route = {

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
                    if (Tool.isType(tPath, "String") && fPath === item) {
                        output = route[item];
                    } else if (Tool.isType(tPath, "Regexp") && tPath.test(fPath)) {
                        output = Tool.merge(route[item], {
                            "path": fPath
                        }, true);
                    }
                });
            }
            //  url中带参数配置项
            if (output && output.regex) {
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

        "navigate": function () {
            var cfg = this.finalCfg;
            var path = cfg.default;
            var cPath = Tool.getHashOrState(cfg.default || "/").path;
            if (cPath) {
                path = cPath;
            }
            this.navigate(path);
            this.initEvents();
        },

        /**
         * 配置
         * @param opt   配置
         */
        "config": function (opt) {

            var finalCfg = Tool.merge(_route.cfg, opt, true),       //  合并传入的参数和原来的默认配置                                           //
                cfgObj = {},                                        //  用来缓存Object方式配置路由的数据
                toMerge = {},                                       //  原来的正则表达式对象和新的属性合并
                cPath,                                              //  Object方式配置路由,会遍历每一项,cPath表示当前一项
                res,                                                //  路由带参数时匹配结果
                regex;                                              //  正则表达式对象

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
            _route.finalCfg = finalCfg;
        },

        /**
         * 初始化事件(有效a标签的click事件,浏览器的前进后退)
         */
        "initEvents": function () {
            var cfg = this.finalCfg, path;

            //  document代理a标签的点击事件
            Event.delegatEvent(document, ["click"], function (ev) {
                ev = ev || event;
                var target = ev.target;
                path = target.getAttribute("href");
                return target.tagName.toLowerCase() === "a" && path;
            }, function () {
                this.navigate(path);
            }.bind(this));

            //  浏览器前进后退
            Event.delegatEvent(root, ["popstate"], true, function (ev) {
                var res = Tool.getHashOrState(cfg.default || "/");
                var path = res.path;
                if (!cfg.pushState) {
                    path = res.hash;
                }
                this.prevOrBack(path);
            }.bind(this));
        }
    };

    var R = {

        "config": _route.config,

        /**
         * 声明controller
         * @param name  controller名称
         * @param fn    controller函数
         */
        "controller": function (name, fn) {
            _store.controllers[_controllerSuffix + name] = {
                "scope": Scope,
                "fn": fn
            };
        },

        /**
         * 声明directive
         * @param name  directive名称
         * @param fn    directive函数
         */
        "directive": function (name, fn) {
            _store.directives[_directiveSuffix + name] = fn;
        },

        /**
         * 声明service
         * @param name  service名称
         * @param fn    service函数
         */
        "service": function (name, fn) {
            _store.service[_serviceSuffix + name] = fn;
        },

        /**
         * 定义一个provider
         * @param name  provider名称
         * @param fn    provider函数
         */
        "provider": function (name, fn) {
            _store.provider[_providerSuffix + name] = fn;
        },

        /**
         * 注入其他依赖
         * @param name  controller名称
         * @param deps  依赖数组
         */
        "inject": function (name, deps) {
            var target = this._get(name);
            if (!target.deps) {
                target.deps = [];
            }
            if (!Tool.isType(deps, "array")) {
                deps = [].slice.call(arguments, 1);
            }

            //  获取之前声明的函数
            deps = deps.map(function (depName) {
                return this._getProvider(depName);
            }, this);

            //  添加到原来的依赖数组中
            target.deps = target.deps.concat(deps);
        },

        /**
         * 启动
         * @param el    根元素
         */
        "bootstrap": function (el) {
            var hashOrState = Tool.getHashOrState("/"),
                path = hashOrState.path || hashOrState.hash,
                cfgCtrlObj = _route.getCurrent(path),
                context = document.querySelector(el),
                ctrlEle = null,
                cfgCtrlName = cfgCtrlObj.controller,
                tplPath = cfgCtrlObj.tplPath,
                deps = [],
                finalCtrl, fragement, divNode;

            //  获取页面模板
            Tool.getRequest({
                "url": tplPath,
                "context": this,
                "success": function (cxt, res) {

                    //  创建一个fragement对象
                    fragement = Dom.createFragment();

                    //  创建一个临时div
                    divNode = document.createElement("div");
                    divNode.innerHTML = res.responseText;

                    //  设置r-controller
                    Dom.setAttributes(divNode, {
                        "r-controller": cfgCtrlName
                    });
                    fragement.appendChild(divNode);
                    context.appendChild(fragement);

                    //  修改ctrlEle的指向
                    ctrlEle = divNode;
                    finalCtrl = _store.controllers[_controllerSuffix + cfgCtrlName];

                    //  存在依赖的情况,执行依赖对应的回调函数
                    //  如果是函数就执行函数,否则直接返回
                    if (finalCtrl.deps) {
                        deps = finalCtrl.deps.map(function (dep) {
                            return Tool.isType(dep, "function") ? dep() : dep;
                        });
                    }

                    //  实例化Compile和scope
                    this._compile = new Compile(ctrlEle);
                    var Scope = new finalCtrl.scope(this._compile);

                    //  scope永远在依赖数组第一个
                    deps.unshift(Scope);

                    //  依赖数组作为参数,传入相关controller
                    finalCtrl.fn.apply(root, deps);

                    //  开始编译
                    Scope.link(ctrlEle);
                },
                "error": function (cxt, ex) {
                }
            });

        },

        /**
         * 获取指定名称对应的provider
         * @param name  provider名称
         * @returns {*}
         */
        "_getProvider": function (name) {
            return _store.provider[_providerSuffix + name] || _store.service[_serviceSuffix + name];
        },

        /**
         * 获取对应的controller
         * @param name  controller名称
         * @returns {*}
         */
        "_get": function (name) {
            return _store.controllers[_controllerSuffix + name];
        }

    };

    //  定义一个provider
    R.provider("pageParams", function () {
        return _route.pageParams;
    });

    return R;

}));
