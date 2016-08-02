/**
 * r-bind指令
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["tool", "dom", "dirBase"], function (Tool, Dom, dirBase) {
            return factory(root, Tool, Dom, dirBase);
        });
    }

}(window, function (root, Tool, Dom, dirBase, undefined) {

    function RBind(dirCfg) {
        dirCfg.name = "RBind";
        dirBase.call(this, dirCfg);
        return this;
    }

    RBind.prototype = {

        "constructor": RBind,

        "link": function (el, exp, scope) {
            var execRes;
            if (this.dataContext) {
                execRes = this.scope.execDeep(this.finalExp, this.dataContext);
            } else {
                execRes = this.scope.execDeep(this.finalExp, this.scope.data);
            }

            this.originalData = execRes.result;
            this.updateExp = execRes.executeStr;

            if (!Tool.isUndefined(this.originalData)) {
                this.el.innerHTML = this.originalData;
            }
        },

        "update": function (exp) {
            var newVal = this.scope.execByStr(this.updateExp, this.scope.data);
            if (!Tool.isEqual(newVal, this.originalData)) {
                this.el.innerHTML = newVal;
                this.originalData = newVal;
            }
        }

    };

    return {
        "name": "RBind",
        "type": "content",
        "constructor": RBind
    };

}));
