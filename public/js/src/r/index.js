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
    var _providerSuffix = "PROVIDER_";          //  Provider前缀

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
        "service": {},
        "provider": {}
    };

    var _route = {

        //  默认配置
        "cfg": {
            "path": {},         //  Object,由path("/","/list"...)做key,value对应一个Object,包含tplPath,controller两个属性
            "pushState": true,  //  是否支持HTML5的pushState,传入false,即采用hash解决方案
            "default": "/",     //  首页
            "root": null        //  根元素
        },

        //  最后的配置参数
        "finalCfg": {},

        //  url中所带参数,包含queryString和path
        "pageParams": {},

        /**
         * 获取当前path在配置中的相关参数
         * @param path  当前页面的path
         * @returns {*}
         */
        "getCurrent": function (path) {
            var route = this.finalCfg.path,
                keys = Object.keys(route),
                fPath = path,
                loopI = 0,
                loopLen = keys.length,
                loopKey, cfgObj, output, urlSplits, cfgSplits;

            this.pageParams = {};

            //  url中存在查询字符串,将url转换成"?"前面的内容,再进行比对
            if (fPath.match(urlQueryStr)) {
                this.pageParams.queryString = Tool.getQueryString(fPath);
                fPath = fPath.split("?")[0];
            }

            for (; loopI < loopLen; loopI++) {
                loopKey = keys[loopI];
                cfgObj = route[loopKey];

                if (Tool.isType(cfgObj.path, "String") && Tool.isUndefined(cfgObj.regex) && Tool.isEqual(cfgObj.path, fPath)) {
                    output = route[loopKey];
                    loopI = 0;
                    break;
                } else if (Tool.isType(cfgObj.path, "Regexp") && cfgObj.regex.test(fPath)) {
                    output = route[loopKey];
                    loopI = 0;
                    break;
                }
            }

            //  url中带参数配置项
            if (output && output.regex) {
                urlSplits = fPath.split("/");
                cfgSplits = output.config.split("/");

                cfgSplits.forEach(function (item, index) {
                    if (("" + item).indexOf(":") > -1) {
                        if (!this.pageParams.path) {
                            this.pageParams.path = {};
                        }
                        this.pageParams.path[item.replace(":", "")] = urlSplits[index];
                    }
                }, this);
            }
            return output;
        },

        /**
         * 点击有效a标签或者pushState后的回调
         * @param callback  成功后的回调
         */
        "navigate": function (callback) {
            var cfg = this.finalCfg,
                cPath = Tool.getHashOrState(cfg.default || "/"),
                path = cfg.pushState ? cPath.path : cPath.hash,
                curCfgObj = this.getCurrent(path),
                framement, divNode;

            if (!curCfgObj) {
                return;
            }

            //  请求模板路径
            this.requestTemplate(curCfgObj.tplPath, function (ctx, res) {
                cfg.root.innerHTML = "";

                //  创建fragement
                framement = Dom.createFragment();
                divNode = document.createElement("div");
                divNode.classList.add("ctrl-ele");

                divNode.innerHTML = Tool.trim(res.response);

                //  依次作为子节点添加
                framement.appendChild(divNode);
                cfg.root.appendChild(framement);

                callback(divNode, curCfgObj);
            }, function (ctx, ex) {
                if (ex.status === 404) {
                    Tool.exception("the template path '" + curCfgObj.tplPath + "' could not be load!");
                }
            });
        },

        /**
         * 根据配置的路径获取模板
         * @param url       模板路径
         * @param success   成功回调
         * @param error     失败回调
         * @param context   回调函数里的this指向
         */
        "requestTemplate": function (url, success, error, context) {
            Tool.getRequest({
                "url": url,
                "context": (context || this),
                "success": success,
                "error": error
            });
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
        "initEvents": function (callback) {
            var cfg = this.finalCfg,
                path, target, tagName, pathEs, loopI, loopLen, child;

            //  所有a标签的点击事件

            Event.delegatEvent(document, ["click"], function (ev) {
                ev = ev || event;
                target = ev.target;

                pathEs = ev.path;

                loopI = 0;
                loopLen = pathEs.length;

                for (; loopI < loopLen; loopI++) {
                    child = pathEs[loopI];
                    if (Dom.isHTMLNode(child)) {
                        path = Dom.getAttributes(child, ["href"]).href;
                        tagName = child.tagName.toLowerCase();

                        if (tagName === "a" && path) {
                            history.pushState({}, "", path);
                            this.navigate(callback);
                            break;
                        }
                    }
                }

                Event.prevDefault(ev);
            }.bind(this));

            //  浏览器前进后退
            Event.delegatEvent(root, ["popstate"], true, function (ev) {
                this.navigate(callback);
                Event.prevDefault(ev);
            }.bind(this));
        }
    };

    var R = {

        /**
         * 代理执行路由模块的config方法
         */
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
            if (!target) {
                return;
            }
            if (!target.deps) {
                target.deps = [];
            }
            if (!Tool.isType(deps, "array")) {
                deps = [].slice.call(arguments, 1);
            }

            //  获取之前声明的函数
            deps = deps.map(function (depName) {
                if (this._getProvider(depName)) {
                    return {
                        "type": "provider",
                        "callback": this._getProvider(depName)
                    };
                } else if (this._getService(depName)) {
                    return {
                        "type": "service",
                        "callback": this._getService(depName)
                    };
                }
            }, this);

            //  添加到原来的依赖数组中
            target.deps = target.deps.concat(deps);
        },

        /**
         * @param el    根元素
         * @param route 是否启用了路由模式
         */
        "bootstrap": function (el, route) {
            var context, controllers, loopArr, loopI, loopLen, loopKey, loopKey2, curCtrl, curCtrlEl;

            route = route || false;

            context = document.querySelector(el);

            /**
             * 启用了路由模式
             * 查找当前页面的path或者hash匹配的路由配置
             * 请求相关模板路径,成功后再对模板进行编译等操作
             */
            if (route) {
                _route.finalCfg.root = context;
                _route.navigate(function (ctrlEle, cfgObj) {
                    this.initScope(ctrlEle, cfgObj);
                    _route.initEvents(this.initScope.bind(this));
                }.bind(this));
            } else {

                /**
                 * 没有启用路由模式
                 * 遍历之前声明的controller对象查找匹配的controller
                 */
                controllers = _store.controllers;
                loopArr = Object.keys(controllers);
                loopI = 0;
                loopLen = loopArr.length;
                for (; loopI < loopLen; loopI++) {
                    loopKey = loopArr[loopI];
                    loopKey2 = loopKey.replace(_controllerSuffix, "");
                    curCtrlEl = Dom.getCtrlElement(loopKey2, context);
                    curCtrl = controllers[loopKey];
                    if (curCtrlEl) {
                        curCtrl = controllers[loopKey];
                        this.initScope(curCtrlEl, {
                            "controller": loopKey2
                        });
                    }
                }
            }

        },

        /**
         * 初始化作用域
         * @param ctrlEle   scope根元素(绑定了r-controller指令)
         * @param cfgObj    配置中保存的信息
         */
        "initScope": function (ctrlEle, cfgObj) {
            var deps = [],
                dataShare = [],
                Scope, listenKeys, depCallback, cfgCtrlName, finalCtrl;

            cfgCtrlName = cfgObj.controller;
            finalCtrl = _store.controllers[_controllerSuffix + cfgCtrlName];

            if (!finalCtrl) {
                return;
            }

            Dom.setAttributes(ctrlEle, {
                "r-controller": cfgCtrlName
            });

            //  存在依赖的情况,执行依赖对应的回调函数
            //  如果是函数就执行函数,否则直接返回
            if (finalCtrl.deps) {
                deps = finalCtrl.deps.map(function (dep) {
                    depCallback = Tool.isType(dep.callback, "function") ? dep.callback() : dep.callback;

                    //  如果这个dependence对应的type为service,则继续放入数据共享的list
                    if (dep.type === "service") {
                        dataShare.push(depCallback);
                    }

                    return depCallback;
                });
            }

            //  实例化Compile和scope
            this._compile = new Compile(ctrlEle);
            Scope = new finalCtrl.scope(this._compile);

            //  如果存在数据共享数组,事先调用scope下的set方法设置数据
            if (dataShare.length) {
                listenKeys = [];
                dataShare.forEach(function (data) {
                    Scope.set(data);
                    listenKeys.concat(Object.keys(data));
                });
                Event.subscribeEvent(Scope, "update share data", listenKeys, function() {
                    Scope.update();
                });
            }

            //  scope永远在依赖数组第一个
            deps.unshift(Scope);

            //  依赖数组作为参数,传入相关controller
            finalCtrl.fn.apply(root, deps);

            //  开始编译
            Scope.link(ctrlEle);
        },

        "_compile": null,

        /**
         * 获取指定名称对应的provider
         * @param name  provider名称
         * @returns {*}
         */
        "_getProvider": function (name) {
            return _store.provider[_providerSuffix + name];
        },

        /**
         * 获取指定名称对应的service
         * @param name  service名称
         * @returns {*}
         */
        "_getService": function (name) {
            return _store.service[_serviceSuffix + name];
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
