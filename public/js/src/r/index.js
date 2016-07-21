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

    var _hasBoots = false;                      //  是否已经启动

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

        "_compile": null,

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

        "bootstrap": function (el) {
            var ctrlName,
                context = document.querySelector(el),
                ctrlEle = null;
            Object.keys(_store.controllers).forEach(function (key) {
                ctrlName = key.replace(_controllerSuffix, "");
                ctrlEle = Dom.getCtrlElement(ctrlName, context);
                if(ctrlEle) {
                    this._compile = new Compile(ctrlEle);
                    var CtrlObj = _store.controllers[key];
                    var Scope = new CtrlObj.scope(this._compile);
                    CtrlObj.fn(Scope);
                    Scope.link(ctrlEle);
                }
            }, this);
        },

        "_get": function (name) {
            return _store.controllers[_controllerSuffix + name] || _store.directives[_directiveSuffix + name];
        },

        "_reset": function () {
            _store = {
                "controllers": {},
                "directives": {},
                "service": {}
            };
            _hasBoots = false;
        }

    };

    return R;

}));
