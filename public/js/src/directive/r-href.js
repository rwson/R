/**
 * r-href指令
 */

"use strict";

(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["tool", "dom", "dirBase"], function(Tool, Dom, dirBase) {
            return factory(root, Tool, Dom, dirBase);
        });
    }

}(window, function(root, Tool, Dom, dirBase, undefined) {

    function RHref(dirCfg) {
        dirCfg.name = "RHref";
        dirBase.call(this, dirCfg);
        return this;
    }

    RHref.prototype = {

        "constructor": RHref,

        "link": function(el, exp, scope) {

            var execRes;
            if (this.dataContext) {
                execRes = this.scope.execDeep(this.finalExp, this.dataContext);
            } else {
                execRes = this.scope.execDeep(this.finalExp, this.scope.data);
            }

            this.originalData = execRes.result;
            this.updateExp = execRes.executeStr;

            Dom.setAttributes(this.el, {
                "href": this.originalData
            });
        },

        "update": function(exp) {
            var newData = this.scope.execByStr(this.updateExp, this.scope.data);
            if (!Tool.isEqual(newData, this.originalData)) {
                Dom.setAttributes(this.el, {
                    "href": newData
                });
                this.originalData = newData;
            }
        }

    };

    return {
        "name": "RHref",
        "type": "content",
        "constructor": RHref
    };

}));
