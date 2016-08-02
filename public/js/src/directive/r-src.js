/**
 * r-src指令
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["tool", "event", "dirBase"], function (Tool, Event, dirBase) {
            return factory(root, Tool, Event, dirBase);
        });
    }

}(window, function (root, Tool, Event, dirBase, undefined) {

    function RSrc(dirCfg) {
        dirCfg.name = "RSrc";
        dirBase.call(this, dirCfg);
    }

    RSrc.prototype = {

        "constructor": RSrc,

        "link": function (el, exp, scope) {
            var execRes;
            if (this.dataContext) {
                execRes = this.scope.execDeep(this.finalExp, this.dataContext);
            } else {
                execRes = this.scope.execDeep(this.finalExp, this.scope.data);
            }

            this.originalData = execRes.result;
            this.updateExp = execRes.executeStr;

            Dom.setAttributes(this.el, {
                "src": this.originalData
            });
            
        },

        "update": function (exp) {
            var newData = this.scope.execByStr(this.updateExp);
            if(!Tool.isEqual(newData, this.originalData)) {
                Dom.setAttributes(this.el, {
                    "src": newData
                });
                this.originalData = newData;
            }
        }

    };

    return {
        "name": "RSrc",
        "type": "dom",
        "constructor": RSrc
    };

}));


