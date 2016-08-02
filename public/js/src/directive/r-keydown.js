/**
 * r-keydown指令
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["tool", "event", "dirBase"], function (Tool, Event, dirBase) {
            return factory(root, Tool, Event, dirBase);
        });
    }

}(window, function (root, Tool, Event, dirBase, undefined) {

    function RKeyDown(dirCfg) {
        dirCfg.name = "RKeyDown";
        dirBase.call(this, dirCfg);
        this.context = root;
        return this;
    }

    RKeyDown.prototype = {

        "constructor": RKeyDown,

        "link": function (el, exp, scope, context) {
            var execRes = this.scope.execDeep(this.finalExp, this.scope.events);
            this.bindFn = execRes.result;

            //  确定函数为函数类型才绑定事件
            if(Tool.isType(this.bindFn, "function")) {
                Event.removeEvent(el, "keydown", this.bindFn);
                Event.addEvent(el, "keydown", this.bindFn.bind(context));
            }
        }

    };

    return {
        "name": "RKeyDown",
        "type": "event",
        "constructor": RKeyDown
    };

}));
