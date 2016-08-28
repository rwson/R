/**
 * r-bind指令
 */

"use strict";

import Tool from "../lib/Tool";
import DirectiveBase from "./direcrive-base";

class RBind extends DirectiveBase {

    constructor(dirCfg) {
        dirCfg.name = "RBind";
        super(dirCfg);
        this.priority = 2;
    }

    link(el, exp, scope) {
        let execRes;
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
    }

    update(exp) {
        var newVal = this.scope.execByStr(this.updateExp, this.scope.data);
        if (!Tool.isEqual(newVal, this.originalData)) {
            this.el.innerHTML = newVal;
            this.originalData = newVal;
        }
    }

}

export default RBind;
