/**
 * r-keydown指令
 */

"use strict";

import Tool from "../lib/Tool";
import EVENT from "../lib/EVENT";
import DirectiveBase from "./direcrive-base";

class RKeyDown extends DirectiveBase {

    constructor(dirCfg) {
        dirCfg.name = "RKeyDown";
        super(dirCfg);
        this.context = window;
    }

    link(el, exp, scope, context) {
        let execRes = this.scope.execDeep(this.finalExp, this.scope.events);
        this.bindFn = execRes.result;

        //  确定函数为函数类型才绑定事件
        if (Tool.isType(this.bindFn, "function")) {
            EVENT.removeEVENT(el, "keydown", this.bindFn);
            EVENT.addEVENT(el, "keydown", this.bindFn.bind(context));
        }
    }

}

export default RKeyDown;
