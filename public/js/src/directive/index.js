/**
 * index.js
 * 指令暴露模块
 */

"use strict";

import Tool from "../lib/Tool";

import DirectiveBase from "./direcrive-base";
import RBind from "./r-bind";
import RClass from "./r-class";
import RClick from "./r-click";
import RCss from "./r-css";
import RElse from "./r-else";
import RFor from "./r-for";
import RHide from "./r-hide";
import RHref from "./r-href";
import RIf from "./r-if";
import RKeyDown from "./r-keydown";
import RKeyUp from "./r-keyup";
import RModel from "./r-model";
import RShow from "./r-show";
import RSrc from "./r-src";

let Directives = {
    RBind,
    RClass,
    RClick,
    RCss,
    RElse,
    RFor,
    RHide,
    RHref,
    RIf,
    RKeyDown,
    RKeyUp,
    RModel,
    RShow,
    RSrc
};

Directives.extend = (name, opt) => {

    let extend = class extends DirectiveBase {

        constructor(opt) {
            super(opt);
            Tool.isType(opt.constructor) && opt.constructor.call(this);
        }

        link() {
            var execRes = this.scope.execDeep(this.finalExp, this.scope.data);
            if (!execRes.result) {
                execRes = this.scope.execDeep(this.finalExp, this.scope.events);
            }
            if (Tool.isType(opt.link, "Function")) {
                opt.link(this.el, execRes);
            }
        }

        update(el, exp) {
            if (Tool.isType(opt.update, "Function")) {
                opt.update();
            }
        }

    };

    Directives[name] = extend;
};

export default Directives;
