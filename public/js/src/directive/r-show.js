/**
 * r-show指令
 */

"use strict";

import Tool from "../lib/Tool";
import EVENT from "../lib/EVENT";
import DirectiveBase from "./direcrive-base";

class RShow extends DirectiveBase {

    constructor(dirCfg) {
        super(dirCfg);
        this.name = "RShow";
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
            this.el.style.display = "block";
        } else {
            this.el.style.display = "none";
        }
    }

    update(exp) {
        let newVal = this.scope.execByStr(this.updateExp, this.scope.data);
        if (!Tool.isEqual(newVal, this.originalData)) {
            if (newVal) {
                this.el.style.display = "block";
            } else {
                this.el.style.display = "none";
            }
            this.originalData = newVal;
        }
    }

}

export default RShow;
