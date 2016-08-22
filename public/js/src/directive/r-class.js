/**
 * r-class指令
 */

"use strict";

import Tool from "../lib/Tool";
import DOM from "../lib/DOM";
import DirectiveBase from "./direcrive-base";

class RClass extends DirectiveBase {

    constructor(dirCfg) {
        super(dirCfg);
        this.name = "RClass";
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
        this.el.classList.add(this.originalData);
    }

    update(exp) {
        let newVal = this.scope.execByStr(this.updateExp, this.scope.data);
        if (!Tool.isEqual(newVal, this.originalData)) {
            this.el.classList.remove(this.originalData);
            this.el.classList.add(newVal);
            this.originalData = newVal;
        }
    }

}

export default RClass;
