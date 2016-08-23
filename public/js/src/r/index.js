/**
 * RouteAble前端路由
 */

"use strict";

import "whatwg-fetch";

import Tool from "../lib/Tool";
import DOM from "../lib/DOM";
import Url from "../lib/Url";
import Compile from "../Compile/index";
import Scope from "../Scope/index";
import Watcher from "../Watcher";
import Directive from "../directive/index";
import Cookie from "../Provider/Cookie";
import Router from "../Provider/Router";

const _controllerSuffix = "CONTROLLER_";      //  Controller前缀
const _directiveSuffix = "DIRECTIVE_";        //  Directive前缀
const _serviceSuffix = "SERVICE_";            //  Service前缀
const _providerSuffix = "PROVIDER_";          //  Provider前缀

const router = new Router();

/**
 * 暂存列表
 * @type {{controllers: {}, directives: {}, service: {}, provider: {}}}
 * @private
 */
let _store = {
    "controllers": {},
    "service": {},
    "provider": {},

    /**
     * 获取指定名称的controller
     * @param name  controller名称
     * @returns {*}
     * @private
     */
    getController:(name) => {
        return _store.controllers[_controllerSuffix + name];
    },

    /**
     * 获取指定名称对应的provider
     * @param name  provider名称
     * @returns {*}
     */
    getProvider: (name) => {
        return _store.provider[_providerSuffix + name];
    },

    /**
     * 获取指定名称对应的service
     * @param name  service名称
     * @returns {*}
     */
    getService: (name)=> {
        return _store.service[_serviceSuffix + name];
    },

    /**
     * 获取对应的controller
     * @param name  controller名称
     * @returns {*}
     */
    get: (name)=> {
        return _store.controllers[_controllerSuffix + name];
    }
};

class R {

    constructor() {
        this.compile = null;
    }

    /**
     * 代理执行路由模块的config方法
     */
    static config(opt) {
        router.config(opt);
    }

    /**
     * 自定义directive
     */
    static directive() {
        Directive.extend.apply(this, arguments);
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

    /**
     * 依赖注入
     * @param name  controller名称
     * @param deps  依赖数组
     */
    static inject(name, deps) {
        let target = _store.get(name);
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
        deps = deps.map((depName) => {
            if (_store.getProvider(depName)) {
                return {
                    "type": "provider",
                    "callback": _store.getProvider(depName)
                };
            } else if (_store.getService(depName)) {
                return {
                    "type": "service",
                    "callback": _store.getService(depName)
                };
            }
        }, this);

        //  添加到原来的依赖数组中
        target.deps = target.deps.concat(deps);
    }

    /**
     * @param el    根元素
     * @param route 是否启用了路由模式
     */
    static bootstrap(el, route) {
        let context, controllers, loopArr, loopI, loopLen, loopKey, loopKey2, curCtrl, curCtrlEl;
        route = route || false;
        context = document.querySelector(el);

        /**
         * 启用了路由模式
         * 查找当前页面的path或者hash匹配的路由配置
         * 请求相关模板路径,成功后再对模板进行编译等操作
         */
        if (route) {
            route.finalCfg.root = context;
            route.navigate((ctrlEle, cfgObj) => {
                this.initScope(ctrlEle, cfgObj);
                route.initEVENTs(this.initScope);
            });
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
                curCtrlEl = DOM.getCtrlElement(loopKey2, context);
                curCtrl = controllers[loopKey];
                if (curCtrlEl) {
                    curCtrl = controllers[loopKey];

                    this.initScope(curCtrlEl, {
                        "controller": loopKey2
                    });
                }
            }
        }

    }

    /**
     * 初始化作用域
     * @param ctrlEle   scope根元素(绑定了r-controller指令)
     * @param cfgObj    配置中保存的信息
     */
    static initScope(ctrlEle, cfgObj) {
        let deps = [],
            dataShare = [],
            listenKeys, scope, depCallback, cfgCtrlName, finalCtrl;
        cfgCtrlName = cfgObj.controller;
        finalCtrl = _store.getController(cfgCtrlName);

        //  controller对象不存在,就不继续往下
        if (!finalCtrl) {
            return;
        }

        DOM.setAttributes(ctrlEle, {
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
        scope = new Scope(new Compile(ctrlEle));

        //  如果存在数据共享数组,事先调用scope下的set方法设置数据
        if (dataShare.length) {
            listenKeys = [];
            dataShare.forEach(function (data) {
                Scope.set(data);

                listenKeys = listenKeys.concat(Object.keys(data));
                listenKeys = listenKeys.map(function (lKey) {
                    return {
                        "key": lKey,
                        "uId": Scope.uId
                    };
                }, this);

                Watcher.subscribe(listenKeys, Scope);
            }, this);
        }

        //  scope永远在依赖数组第一个
        deps.unshift(scope);

        //  依赖数组作为参数,传入相关controller
        finalCtrl.fn.apply(window, deps);

        //  开始编译
        scope.link(ctrlEle);
    }

}

/**
 * pageParams
 * 用于获取url上的参数(queryString/path)
 */
R.provider("pageParams", function () {

    console.log(router);

    return Tool.merge(router.pageParams, {
        "urlQueryString": Url.getQueryString()
    });
});

/**
 * ajax
 * 向后端发送http请求(具体用法参照jQuery)
 */
R.provider("http", fetch);

window.R = R;
