/**
 * r-keyup指令
 */

"use strict";

import Tool from "../lib/Tool";
import Event from "../lib/Event";
import DirectiveBase from "./direcrive-base";

class RKeyUp extends DirectiveBase {


    constructor(dirCfg) {
        super(dirCfg);
    }

    link(el, exp, scope, context) {
        this.bindFn = this.scope.execDeep(this.finalExp, this.scope.events).result;
        if (Tool.isType(this.bindFn, "function")) {
            Event.removeEvent(el, "keyup", this.bindFn.bind(context));
            Event.addEvent(el, "keyup", this.bindFn.bind(context));
        }
    }

}

export default RKeyUp;
