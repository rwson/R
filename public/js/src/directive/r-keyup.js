/**
 * r-keyup指令
 */

"use strict";

import Tool from "../lib/Tool";
import EVENT from "../lib/EVENT";
import DirectiveBase from "./direcrive-base";

class RKeyUp extends DirectiveBase {


    constructor(dirCfg) {
        dirCfg.name = "RKeyUp";
        super(dirCfg);
    }

    link(el, exp, scope, context) {
        this.bindFn = this.scope.execDeep(this.finalExp, this.scope.events).result;
        if (Tool.isType(this.bindFn, "function")) {
            EVENT.removeEVENT(el, "keyup", this.bindFn.bind(context));
            EVENT.addEVENT(el, "keyup", this.bindFn.bind(context));
        }
    }

}

export default RKeyUp;
