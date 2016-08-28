/**
 * r-css指令
 */

"use strict";

import Tool from "../lib/Tool";
import DirectiveBase from "./direcrive-base";

class RCss extends DirectiveBase {

    constructor(dirCfg) {
        dirCfg.name = "RCss";
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

        this.el.style.cssText += this.originalData;
    }

    update(exp) {
        let newVal = this.scope.execByStr(this.updateExp, this.scope.data),
            cssText = this.el.style.cssText;

        if (!Tool.isEqual(newVal, this.originalData)) {
            cssText = cssText.replace(this.originalData, "") + newVal;
            this.el.style.cssText = cssText;
            this.originalData = newVal;
        }
    }

}

export default RCss;
