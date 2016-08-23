/**
 * r-href指令
 */

"use strict";

import Tool from "../lib/Tool";
import DOM from "../lib/DOM";
import DirectiveBase from "./direcrive-base";

class RHref extends DirectiveBase {

    constructor(dirCfg) {
        dirCfg.name = "RHref";
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

        DOM.setAttributes(this.el, {
            "href": this.originalData
        });
    }

    update(exp) {
        let newData = this.scope.execByStr(this.updateExp, this.scope.data);
        if (!Tool.isEqual(newData, this.originalData)) {
            DOM.setAttributes(this.el, {
                "href": newData
            });
            this.originalData = newData;
        }
    }

}

export default RHref;
