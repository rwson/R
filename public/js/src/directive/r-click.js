/**
 * r-click指令
 */

"use strict";

import Tool from "../lib/Tool";
import DOM from "../lib/DOM";
import EVENT from "../lib/EVENT";
import DirectiveBase from "./direcrive-base";

class RClick extends DirectiveBase {

    constructor(dirCfg) {
        super(dirCfg);
        this.name = "RClick";
    }

    link(el, exp, scope, context) {
        this.bindFn = this.scope.execDeep(this.finalExp, this.scope.events).result;
        if (Tool.isType(this.bindFn, "function")) {
            EVENT.removeEVENT(el, "click", this.bindFn);
            EVENT.addEVENT(el, "click", this.bindFn.bind(context));
        }
    }

}

export default RClick;
