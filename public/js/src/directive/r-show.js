/**
 * r-show指令
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["tool", "event", "dirBase"], function (Tool, Event, dirBase) {
            return factory(root, Tool, Event, dirBase);
        });
    }

}(window, function (root, Tool, Event, dirBase, undefined) {

    function RShow(dirCfg) {
        dirCfg.name = "RShow";
        dirBase.call(this, dirCfg);
    }

    RShow.prototype = {

        "constructor": RShow,

        "link": function (el, exp, scope) {
            var execRes;
            if (this.dataContext) {
                execRes = this.scope.execDeep(this.finalExp, this.dataContext);
            } else {
                execRes = this.scope.execDeep(this.finalExp, this.scope.data);
            }

            this.originalData = execRes.result;
            this.updateExp = execRes.executeStr;


            if(this.originalData) {
                this.el.style.display = "block";
            } else {
                this.el.style.display = "none";
            }
        },

        "update": function (exp) {
            var newVal = this.scope.execByStr(this.updateExp, this.scope.data);

            if(!Tool.isEqual(newVal, this.originalData)) {
                if(newVal) {
                    this.el.style.display = "block";    
                } else {
                    this.el.style.display = "none";    
                }
                this.originalData = newVal;
            }
        }

    };

    return {
        "name": "RShow",
        "type": "control",
        "constructor": RShow
    };

}));


