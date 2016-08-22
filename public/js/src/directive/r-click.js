/**
 * r-click指令
 */

"use strict";

import Tool from "../lib/Tool";
import DOM from "../lib/DOM";
import Event from "../lib/Event";
import DirectiveBase from "./direcrive-base";

class RClick extends DirectiveBase {

    constructor(dirCfg) {
        super(dirCfg);
        this.name = "RClick";
    }

    link(el, exp, scope, context) {
        this.bindFn = this.scope.execDeep(this.finalExp, this.scope.events).result;
        if (Tool.isType(this.bindFn, "function")) {
            Event.removeEvent(el, "click", this.bindFn);
            Event.addEvent(el, "click", this.bindFn.bind(context));
        }
    }

}

export default RClick;
