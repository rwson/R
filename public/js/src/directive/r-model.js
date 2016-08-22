/**
 * r-model指令
 */

"use strict";

import Tool from "../lib/Tool";
import DOM from "../lib/DOM";
import Event from "../lib/Event";
import DirectiveBase from "./direcrive-base";

const textTypeReg = /text|password|number|tel|email|url/, //  可以输入的几种文本类型
    checkTypeReg = /radio|checkbox/,                    //  单复选
    changeTypeReg = /date|month|time|week|range/;       //  change以后的几种
let tagName, elType, disabled, rid, isAvailable;

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

class RModel extends DirectiveBase {

    constructor(dirCfg) {
        super(dirCfg);
        this.name = "RModel";
    }

    link(el, exp, scope) {
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
                Event.addEvent(el, ["keydown", "keypress", "keyup"], function () {
                    _doUpdate.call(this, el.value, scope);
                }.bind(this));

            } else if (Tool.isEqual(tagName, "input") && checkTypeReg.test(elType)) {

                if (!Tool.isUndefined(exp)) {
                    this.el.checked = this.originalData;
                }

                Event.removeEvent(el, "click");
                Event.addEvent(el, "click", function () {
                    _doUpdate.call(this, el.checked, scope);
                }.bind(this));

            } else if ((Tool.isEqual(tagName, "input") && (changeTypeReg.test(elType))) || Tool.isEqual(tagName, "select")) {

                if (!Tool.isUndefined(exp)) {
                    this.el.value = this.originalData;
                }

                Event.removeEvent(el, "change");
                Event.addEvent(el, "change", function () {
                    _doUpdate.call(this, el.value, scope);
                }.bind(this));
            }
        }
    }

    update() {
        var newVal = this.scope.execByStr(this.updateExp, this.scope.data);
        if (!Tool.isEqual(newVal, this.originalData)) {
            this.el.value = newVal;
            this.originalData = newVal;
        }
    }

}

export default RModel;
