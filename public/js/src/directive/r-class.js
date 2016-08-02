/**
 * r-class指令
 */

"use strict";

(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["tool", "dom", "dirBase"], function(Tool, Dom, dirBase) {
            return factory(root, Tool, Dom, dirBase);
        });
    }

}(window, function(root, Tool, Dom, dirBase, undefined) {

    function RClass(dirCfg) {
        dirCfg.name = "RClass";
        dirBase.call(this, dirCfg);
        return this;
    }

    RClass.prototype = {

        "constructor": RClass,

        "link": function(el, exp, scope) {
            var execRes;
            if (this.dataContext) {
                execRes = this.scope.execDeep(this.finalExp, this.dataContext);
            } else {
                execRes = this.scope.execDeep(this.finalExp, this.scope.data);
            }

            this.originalData = execRes.result;
            this.updateExp = execRes.executeStr;

			this.el.classList.add(this.originalData);
        },

        "update": function(exp) {
            var newVal = this.scope.execByStr(this.updateExp, this.scope.data);

            if (!Tool.isEqual(newVal, this.originalData)) {
            	this.el.classList.remove(this.originalData);
            	this.el.classList.add(newVal);
            	this.originalData = newVal;
            }
        }

    };

    return {
        "name": "RClass",
        "type": "dom",
        "constructor": RClass
    };

}));
