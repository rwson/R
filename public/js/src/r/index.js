/**
 * RouteAble前端路由
 */

"use strict";

import "whatwg-fetch";

import Tool from "../lib/Tool";
import DOM from "../lib/DOM";
import Compile from "../Compile/index";
import Scope from "../Scope/index";
import Watcher from "../Watcher";
import Directive from "../directive/index";
import Cookie from "../Provider/Cookie";

const _controllerSuffix = "CONTROLLER_";      //  Controller前缀
const _directiveSuffix = "DIRECTIVE_";        //  Directive前缀
const _serviceSuffix = "SERVICE_";            //  Service前缀
const _providerSuffix = "PROVIDER_";          //  Provider前缀

/**
 * 暂存列表
 * @type {{controllers: {}, directives: {}, service: {}, provider: {}}}
 * @private
 */
let _store = {
    "controllers": {},
    "service": {},
    "provider": {}
};

class R {

    constructor() {
        this.compile = null;
    }

    /**
     * 声明一个controller
     * @param name  controller名称
     * @param fn    回调函数
     */
    static controller(name, fn) {
        _store.controllers[_controllerSuffix + name] = {
            "fn": fn
        };
    }

    /**
     * 声明service
     * @param name  service名称
     * @param fn    service函数
     */
    static service(name, fn) {
        _store.service[_serviceSuffix + name] = fn;
    }


    /**
     * 定义一个provider
     * @param name  provider名称
     * @param fn    provider函数
     */
    static provider(name, fn) {
        _store.provider[_providerSuffix + name] = fn;
    }

}

//var R = {
//
//    /**
//     * 代理执行路由模块的config方法
//     */
//    "config": _route.config,
//
//    /**
//     * 声明controller
//     * @param name  controller名称
//     * @param fn    controller函数
//     */
//    "controller": function (name, fn) {
//        _store.controllers[_controllerSuffix + name] = {
//            "scope": Scope,
//            "fn": fn
//        };
//    },
//
//    /**
//     * 自定义directive
//     */
//    "directive": directive.extend,
//
//    /**
//     * 声明service
//     * @param name  service名称
//     * @param fn    service函数
//     */
//    "service": function (name, fn) {
//        _store.service[_serviceSuffix + name] = fn;
//    },
//
//    /**
//     * 定义一个provider
//     * @param name  provider名称
//     * @param fn    provider函数
//     */
//    "provider": function (name, fn) {
//        _store.provider[_providerSuffix + name] = fn;
//    },
//
//    /**
//     * 注入其他依赖
//     * @param name  controller名称
//     * @param deps  依赖数组
//     */
//    "inject": function (name, deps) {
//        var target = this._get(name);
//        if (!target) {
//            return;
//        }
//        if (!target.deps) {
//            target.deps = [];
//        }
//        if (!Tool.isType(deps, "array")) {
//            deps = [].slice.call(arguments, 1);
//        }
//
//        //  获取之前声明的函数
//        deps = deps.map(function (depName) {
//            if (this._getProvider(depName)) {
//                return {
//                    "type": "provider",
//                    "callback": this._getProvider(depName)
//                };
//            } else if (this._getService(depName)) {
//                return {
//                    "type": "service",
//                    "callback": this._getService(depName)
//                };
//            }
//        }, this);
//
//        //  添加到原来的依赖数组中
//        target.deps = target.deps.concat(deps);
//    },
//
//    /**
//     * @param el    根元素
//     * @param route 是否启用了路由模式
//     */
//    "bootstrap": function (el, route) {
//        var context, controllers, loopArr, loopI, loopLen, loopKey, loopKey2, curCtrl, curCtrlEl;
//
//        route = route || false;
//
//        context = document.querySelector(el);
//
//        /**
//         * 启用了路由模式
//         * 查找当前页面的path或者hash匹配的路由配置
//         * 请求相关模板路径,成功后再对模板进行编译等操作
//         */
//        if (route) {
//            _route.finalCfg.root = context;
//            _route.navigate(function (ctrlEle, cfgObj) {
//                this.initScope(ctrlEle, cfgObj);
//                _route.initEVENTs(this.initScope.bind(this));
//            }.bind(this));
//        } else {
//
//            /**
//             * 没有启用路由模式
//             * 遍历之前声明的controller对象查找匹配的controller
//             */
//            controllers = _store.controllers;
//            loopArr = Object.keys(controllers);
//            loopI = 0;
//            loopLen = loopArr.length;
//            for (; loopI < loopLen; loopI++) {
//                loopKey = loopArr[loopI];
//                loopKey2 = loopKey.replace(_controllerSuffix, "");
//                curCtrlEl = Dom.getCtrlElement(loopKey2, context);
//                curCtrl = controllers[loopKey];
//                if (curCtrlEl) {
//                    curCtrl = controllers[loopKey];
//                    this.initScope(curCtrlEl, {
//                        "controller": loopKey2
//                    });
//                }
//            }
//        }
//
//    },
//
//    /**
//     * 初始化作用域
//     * @param ctrlEle   scope根元素(绑定了r-controller指令)
//     * @param cfgObj    配置中保存的信息
//     */
//    "initScope": function (ctrlEle, cfgObj) {
//        var deps = [],
//            dataShare = [],
//            listenKeys, Scope, depCallback, cfgCtrlName, finalCtrl;
//
//        cfgCtrlName = cfgObj.controller;
//        finalCtrl = _store.controllers[_controllerSuffix + cfgCtrlName];
//
//        //  controller对象不存在,就不继续往下
//        if (!finalCtrl) {
//            return;
//        }
//
//        Dom.setAttributes(ctrlEle, {
//            "r-controller": cfgCtrlName
//        });
//
//        //  存在依赖的情况,执行依赖对应的回调函数
//        //  如果是函数就执行函数,否则直接返回
//        if (finalCtrl.deps) {
//            deps = finalCtrl.deps.map(function (dep) {
//                depCallback = Tool.isType(dep.callback, "function") ? dep.callback() : dep.callback;
//
//                //  如果这个dependence对应的type为service,则继续放入数据共享的list
//                if (dep.type === "service") {
//                    dataShare.push(depCallback);
//                }
//
//                return depCallback;
//            });
//        }
//
//        //  实例化Compile和scope
//        this._compile = new Compile(ctrlEle);
//        Scope = new finalCtrl.scope(this._compile);
//
//        //  如果存在数据共享数组,事先调用scope下的set方法设置数据
//        if (dataShare.length) {
//            listenKeys = [];
//            dataShare.forEach(function (data) {
//                Scope.set(data);
//
//                listenKeys = listenKeys.concat(Object.keys(data));
//                listenKeys = listenKeys.map(function (lKey) {
//                    return {
//                        "key": lKey,
//                        "uId": Scope.uId
//                    };
//                }, this);
//
//                Watcher.subscribe(listenKeys, Scope);
//            }, this);
//        }
//
//        //  scope永远在依赖数组第一个
//        deps.unshift(Scope);
//
//        //  依赖数组作为参数,传入相关controller
//        finalCtrl.fn.apply(root, deps);
//
//        //  开始编译
//        Scope.link(ctrlEle);
//    },
//
//    "_compile": null,
//
//    /**
//     * 获取指定名称对应的provider
//     * @param name  provider名称
//     * @returns {*}
//     */
//    "_getProvider": function (name) {
//        return _store.provider[_providerSuffix + name];
//    },
//
//    /**
//     * 获取指定名称对应的service
//     * @param name  service名称
//     * @returns {*}
//     */
//    "_getService": function (name) {
//        return _store.service[_serviceSuffix + name];
//    },
//
//    /**
//     * 获取对应的controller
//     * @param name  controller名称
//     * @returns {*}
//     */
//    "_get": function (name) {
//        return _store.controllers[_controllerSuffix + name];
//    }
//
//};

/**
 * pageParams
 * 用于获取url上的参数(queryString/path)
 */
R.provider("pageParams", function () {
    return _route.pageParams;
});

/**
 * ajax
 * 向后端发送http请求(具体用法参照jQuery)
 */
R.provider("http", fetch);

window.R = R;

//(function (root, factory) {
//    if (typeof define === "function" && define.amd) {
//        define([
//            "tool",
//            "dom",
//            "event",
//            "compile",
//            "scope",
//            "watcher",
//            "directive",
//            "ajax"
//        ], function (Tool, Dom, EVENT, Compile, Scope, Watcher, directive, ajax) {
//            return factory(window, Tool, Dom, EVENT, Compile, Scope, Watcher, directive, ajax);
//        });
//    }
//}(window, function (root, Tool, Dom, EVENT, Compile, Scope, Watcher, directive, ajax, undefined) {
//
//
//    /**
//     * 路由模块
//     * @type {{cfg: {path: {}, pushState: boolean, default: string, root: null}, finalCfg: {}, pageParams: {}, getCurrent: Function, navigate: Function, requestTemplate: Function, config: Function, initEVENTs: Function}}
//     * @private
//     */
//    var R = {
//
//        /**
//         * 代理执行路由模块的config方法
//         */
//        "config": _route.config,
//
//        /**
//         * 声明controller
//         * @param name  controller名称
//         * @param fn    controller函数
//         */
//        "controller": function (name, fn) {
//            _store.controllers[_controllerSuffix + name] = {
//                "scope": Scope,
//                "fn": fn
//            };
//        },
//
//        /**
//         * 自定义directive
//         */
//        "directive": directive.extend,
//
//        /**
//         * 声明service
//         * @param name  service名称
//         * @param fn    service函数
//         */
//        "service": function (name, fn) {
//            _store.service[_serviceSuffix + name] = fn;
//        },
//
//        /**
//         * 定义一个provider
//         * @param name  provider名称
//         * @param fn    provider函数
//         */
//        "provider": function (name, fn) {
//            _store.provider[_providerSuffix + name] = fn;
//        },
//
//        /**
//         * 注入其他依赖
//         * @param name  controller名称
//         * @param deps  依赖数组
//         */
//        "inject": function (name, deps) {
//            var target = this._get(name);
//            if (!target) {
//                return;
//            }
//            if (!target.deps) {
//                target.deps = [];
//            }
//            if (!Tool.isType(deps, "array")) {
//                deps = [].slice.call(arguments, 1);
//            }
//
//            //  获取之前声明的函数
//            deps = deps.map(function (depName) {
//                if (this._getProvider(depName)) {
//                    return {
//                        "type": "provider",
//                        "callback": this._getProvider(depName)
//                    };
//                } else if (this._getService(depName)) {
//                    return {
//                        "type": "service",
//                        "callback": this._getService(depName)
//                    };
//                }
//            }, this);
//
//            //  添加到原来的依赖数组中
//            target.deps = target.deps.concat(deps);
//        },
//
//        /**
//         * @param el    根元素
//         * @param route 是否启用了路由模式
//         */
//        "bootstrap": function (el, route) {
//            var context, controllers, loopArr, loopI, loopLen, loopKey, loopKey2, curCtrl, curCtrlEl;
//
//            route = route || false;
//
//            context = document.querySelector(el);
//
//            /**
//             * 启用了路由模式
//             * 查找当前页面的path或者hash匹配的路由配置
//             * 请求相关模板路径,成功后再对模板进行编译等操作
//             */
//            if (route) {
//                _route.finalCfg.root = context;
//                _route.navigate(function (ctrlEle, cfgObj) {
//                    this.initScope(ctrlEle, cfgObj);
//                    _route.initEVENTs(this.initScope.bind(this));
//                }.bind(this));
//            } else {
//
//                /**
//                 * 没有启用路由模式
//                 * 遍历之前声明的controller对象查找匹配的controller
//                 */
//                controllers = _store.controllers;
//                loopArr = Object.keys(controllers);
//                loopI = 0;
//                loopLen = loopArr.length;
//                for (; loopI < loopLen; loopI++) {
//                    loopKey = loopArr[loopI];
//                    loopKey2 = loopKey.replace(_controllerSuffix, "");
//                    curCtrlEl = Dom.getCtrlElement(loopKey2, context);
//                    curCtrl = controllers[loopKey];
//                    if (curCtrlEl) {
//                        curCtrl = controllers[loopKey];
//                        this.initScope(curCtrlEl, {
//                            "controller": loopKey2
//                        });
//                    }
//                }
//            }
//
//        },
//
//        /**
//         * 初始化作用域
//         * @param ctrlEle   scope根元素(绑定了r-controller指令)
//         * @param cfgObj    配置中保存的信息
//         */
//        "initScope": function (ctrlEle, cfgObj) {
//            var deps = [],
//                dataShare = [],
//                listenKeys, Scope, depCallback, cfgCtrlName, finalCtrl;
//
//            cfgCtrlName = cfgObj.controller;
//            finalCtrl = _store.controllers[_controllerSuffix + cfgCtrlName];
//
//            //  controller对象不存在,就不继续往下
//            if (!finalCtrl) {
//                return;
//            }
//
//            Dom.setAttributes(ctrlEle, {
//                "r-controller": cfgCtrlName
//            });
//
//            //  存在依赖的情况,执行依赖对应的回调函数
//            //  如果是函数就执行函数,否则直接返回
//            if (finalCtrl.deps) {
//                deps = finalCtrl.deps.map(function (dep) {
//                    depCallback = Tool.isType(dep.callback, "function") ? dep.callback() : dep.callback;
//
//                    //  如果这个dependence对应的type为service,则继续放入数据共享的list
//                    if (dep.type === "service") {
//                        dataShare.push(depCallback);
//                    }
//
//                    return depCallback;
//                });
//            }
//
//            //  实例化Compile和scope
//            this._compile = new Compile(ctrlEle);
//            Scope = new finalCtrl.scope(this._compile);
//
//            //  如果存在数据共享数组,事先调用scope下的set方法设置数据
//            if (dataShare.length) {
//                listenKeys = [];
//                dataShare.forEach(function (data) {
//                    Scope.set(data);
//
//                    listenKeys = listenKeys.concat(Object.keys(data));
//                    listenKeys = listenKeys.map(function (lKey) {
//                        return {
//                            "key": lKey,
//                            "uId": Scope.uId
//                        };
//                    }, this);
//
//                    Watcher.subscribe(listenKeys, Scope);
//                }, this);
//            }
//
//            //  scope永远在依赖数组第一个
//            deps.unshift(Scope);
//
//            //  依赖数组作为参数,传入相关controller
//            finalCtrl.fn.apply(root, deps);
//
//            //  开始编译
//            Scope.link(ctrlEle);
//        },
//
//        "_compile": null,
//
//        /**
//         * 获取指定名称对应的provider
//         * @param name  provider名称
//         * @returns {*}
//         */
//        "_getProvider": function (name) {
//            return _store.provider[_providerSuffix + name];
//        },
//
//        /**
//         * 获取指定名称对应的service
//         * @param name  service名称
//         * @returns {*}
//         */
//        "_getService": function (name) {
//            return _store.service[_serviceSuffix + name];
//        },
//
//        /**
//         * 获取对应的controller
//         * @param name  controller名称
//         * @returns {*}
//         */
//        "_get": function (name) {
//            return _store.controllers[_controllerSuffix + name];
//        }
//
//    };
//
//    /**
//     * pageParams
//     * 用于获取url上的参数(queryString/path)
//     */
//    R.provider("pageParams", function () {
//        return _route.pageParams;
//    });
//
//    /**
//     * ajax
//     * 向后端发送http请求(具体用法参照jQuery)
//     */
//    R.provider("http", function () {
//        return ajax;
//    });
//
//    return R;
//
//}));
