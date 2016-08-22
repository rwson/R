/**
 * r-src指令
 */

"use strict";

import Tool from "../lib/Tool";
import DOM from "../lib/DOM";
import DirectiveBase from "./direcrive-base";

class RSrc extends DirectiveBase {

    constructor(dirCfg) {
        super(dirCfg);
        this.name = "RSrc";
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

        DOM.setAttributes(this.el, {
            "src": this.originalData
        });
    }

    update() {
        let newData = this.scope.execByStr(this.updateExp);
        if (!Tool.isEqual(newData, this.originalData)) {
            DOM.setAttributes(this.el, {
                "src": newData
            });
            this.originalData = newData;
        }
    }
}

export default RSrc;
