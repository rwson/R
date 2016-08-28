/**
 * r-hide指令
 */

"use strict";

import Tool from "../lib/Tool";
import DirectiveBase from "./direcrive-base";

class RHide extends DirectiveBase {

    constructor(dirCfg) {
        dirCfg.name = "RHide";
        super(dirCfg);
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


        if (this.originalData) {
            this.el.style.display = "none";
        } else {
            this.el.style.display = "block";
        }
    }

    update(exp) {
        let newVal = this.scope.execByStr(this.updateExp, this.scope.data);
        if (!Tool.isEqual(newVal, this.originalData)) {
            if (newVal) {
                this.el.style.display = "none";
            } else {
                this.el.style.display = "block";
            }
            this.originalData = newVal;
        }
    }
}

export default RHide;
