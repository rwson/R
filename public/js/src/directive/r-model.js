/**
 * r-model指令
 */

"use strict";

(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["tool", "event", "dom", "dirBase"], function(Tool, Event, Dom, dirBase) {
            return factory(root, Tool, Event, Dom, dirBase);
        });
    }

}(window, function(root, Tool, Event, Dom, dirBase, undefined) {

    var textTypeReg = /text|password|number|tel|email|url/, //  可以输入的几种文本类型
        checkTypeReg = /radio|checkbox/,                    //  单复选
        changeTypeReg = /date|month|time|week|range/,       //  change以后的几种
        tagName, elType, disabled, rid, isAvailable;

    function RModel(dirCfg) {
        dirCfg.name = "RModel";
        dirBase.call(this, dirCfg);
        return this;
    }

    RModel.prototype = {

        "constructor": RModel,

        "link": function(el, exp, scope) {
            //  获取当前元素相关信息
            tagName = el.tagName.toLowerCase();
            elType = el.type;
            disabled = el.disabled;
            isAvailable = Dom.isHide(el) || Dom.isExist(el);

            var execRes;
            if (this.dataContext) {
                execRes = this.scope.execDeep(this.finalExp, this.dataContext);
            } else {
                execRes = this.scope.execDeep(this.finalExp, this.scope.data);
            }
            this.originalData = execRes.result;
            this.updateExp = execRes.executeStr;

            if (isAvailable && !disabled) {
                if ((Tool.isEqual(tagName, "input") && (!elType || textTypeReg.test(elType))) || Tool.isEqual(tagName, "textarea")) {

                    if (!Tool.isUndefined(this.originalData)) {
                        this.el.value = this.originalData;
                    }

                    Event.removeEvent(el, ["keydown", "keypress", "keyup"]);
                    Event.addEvent(el, ["keydown", "keypress", "keyup"], function() {
                        _doUpdate.call(this, el.value, scope);
                    }.bind(this));

                } else if (Tool.isEqual(tagName, "input") && checkTypeReg.test(elType)) {

                    if (!Tool.isUndefined(exp)) {
                        this.el.checked = this.originalData;
                    }

                    Event.removeEvent(el, "click");
                    Event.addEvent(el, "click", function() {
                        _doUpdate.call(this, el.checked, scope);
                    }.bind(this));

                } else if ((Tool.isEqual(tagName, "input") && (changeTypeReg.test(elType))) || Tool.isEqual(tagName, "select")) {

                    if (!Tool.isUndefined(exp)) {
                        this.el.value = this.originalData;
                    }

                    Event.removeEvent(el, "change");
                    Event.addEvent(el, "change", function() {
                        _doUpdate.call(this, el.value, scope);
                    }.bind(this));
                }
            }
        },

        "update": function() {
            var newVal = this.scope.execByStr(this.updateExp, this.scope.data);
            if (!Tool.isEqual(newVal, this.originalData)) {
                this.el.value = newVal;
                this.originalData = newVal;
            }
        }
    };

    /**
     * 根据相关表单域的值
     * @param value     新的值
     * @param scope     当前指令所属Scope
     * @private
     */
    function _doUpdate(value, scope) {
        var update = {};
        update[this.finalExp] = value;
        scope.update(update);
    }

    return {
        "name": "RModel",
        "type": "dom",
        "constructor": RModel
    };

}));
