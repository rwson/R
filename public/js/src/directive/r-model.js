/**
 * r-model指令
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["tool", "event", "dirBase"], function (Tool, Event, dirBase) {
            return factory(root, Tool, Event, dirBase);
        });
    }

}(window, function (root, Tool, Event, dirBase, undefined) {

    var textTypeReg = /text|password|number|tel|email|url/gi,           //  可以输入的几种文本类型
        checkTypeReg = /radio|checkbox/gi,                              //  单复选
        changeTypeReg = /^[date|month|time|week|range]/,                //  change以后的几种
        tagName, elType, disabled;

    function RModel(dirCfg) {
        dirBase.call(this, dirCfg);
        this.priority = 4;
        return this;
    }

    RModel.prototype = {

        "constructor": RModel,

        "link": function (el, exp, scope) {

            //  修正scope
            this.scope = this.scope || scope;

            //  获取当前元素相关信息
            tagName = el.tagName.toLowerCase();
            elType = el.type;
            disabled = el.disabled;

            if (!disabled) {
                if ((Tool.isEqual(tagName, "input") && (!elType || textTypeReg.test(elType)))
                    || Tool.isEqual(tagName, "textarea")) {

                    if (!Tool.isUndefined(exp)) {
                        el.value = exp;
                    }

                    Event.removeEvent(el, ["keydown", "keypress", "keyup"]);
                    Event.addEvent(el, ["keydown", "keypress", "keyup"], function () {
                        _doUpdate.call(this, el.value, scope);
                    }.bind(this));

                } else if (Tool.isEqual(tagName, "input") && checkTypeReg.test(elType)) {

                    if (!Tool.isUndefined(exp)) {
                        el.checked = exp;
                    }


                    Event.removeEvent(el, "click");
                    Event.addEvent(el, "click", function () {
                        _doUpdate.call(this, el.checked, scope);
                    }.bind(this));

                } else if (Tool.isEqual(tagName, "input") && (changeTypeReg.test(elType))) {

                    if (!Tool.isUndefined(exp)) {
                        el.value = exp;
                    }

                    Event.removeEvent(el, "change");
                    Event.addEvent(el, "change", function () {
                        _doUpdate.call(this, el.value, scope);
                    }.bind(this));
                }
            }
        },

        "update": function (val) {
            this.el.value = val;
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
        update[this.exp] = value;
        scope.update(update);
    }

    return {
        "name": "RModel",
        "type": "dom",
        "priority": 4,
        "constructor": RModel
    };

}));
