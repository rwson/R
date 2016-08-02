/**
 * r-css指令
 */

"use strict";

(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["tool", "dom", "dirBase"], function(Tool, Dom, dirBase) {
            return factory(root, Tool, Dom, dirBase);
        });
    }

}(window, function(root, Tool, Dom, dirBase, undefined) {

    function RCss(dirCfg) {
        dirCfg.name = "RCss";
        dirBase.call(this, dirCfg);
        return this;
    }

    RCss.prototype = {

        "constructor": RCss,

        "link": function(el, exp, scope) {
            var execRes;
            if (this.dataContext) {
                execRes = this.scope.execDeep(this.finalExp, this.dataContext);
            } else {
                execRes = this.scope.execDeep(this.finalExp, this.scope.data);
            }

            this.originalData = execRes.result;
            this.updateExp = execRes.executeStr;

			this.el.style.cssText += this.originalData;
        },

        "update": function(exp) {
            var newVal = this.scope.execByStr(this.updateExp, this.scope.data);
            var cssText = this.el.style.cssText;

            if (!Tool.isEqual(newVal, this.originalData)) {
                cssText = cssText.replace(this.originalData, "") + newVal;
            	this.el.style.cssText = cssText;
            	this.originalData = newVal;
            }
        }

    };

    return {
        "name": "RCss",
        "type": "dom",
        "constructor": RCss
    };

}));
