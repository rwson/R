/**
 * r-option指令
 */

"use strict";

(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["tool", "event", "dirBase"], function(Tool, Event, dirBase) {
            return factory(root, Tool, Event, dirBase);
        });
    }

}(window, function(root, Tool, Event, dirBase, undefined) {

    function ROption(dirCfg) {
        dirCfg.name = "ROption";
        dirBase.call(this, dirCfg);
    }

    ROption.prototype = {

        "constructor": ROption,

        "link": function(el, exp, scope) {
            var execRes, fragement, option;
            if (this.dataContext) {
                execRes = this.scope.execDeep(this.finalExp, this.dataContext);
            } else {
                execRes = this.scope.execDeep(this.finalExp, this.scope.data);
            }

            this.originalData = execRes.result;
            this.updateExp = execRes.executeStr;

            if (Tool.isEqual(this.el.tagName.toLowerCase(), "select") && !this.el.disabled) {
                fragement = Dom.createFragment();
                this.el.innerHTML = "";
                if (this.originalData && this.originalData.length) {
                    this.originalData.forEach(function(data) {
                        
                    });
                }
            }

        },

        "update": function(exp) {
            var newData = this.scope.execByStr(this.updateExp);
            if (!Tool.isEqual(newData, this.originalData)) {
                Dom.setAttributes(this.el, {
                    "src": newData
                });
                this.originalData = newData;
            }
        }

    };

    return {
        "name": "ROption",
        "type": "dom",
        "constructor": ROption
    };

}));
