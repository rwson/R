/**
 * r-else指令
 */

"use strict";

import Tool from "../lib/Tool";
import EVENT from "../lib/EVENT";
import DOM from "../lib/DOM";
import DirectiveBase from "./direcrive-base";

class RElse extends DirectiveBase {

    constructor(dirCfg) {
        dirCfg.name = "RElse";
        super(dirCfg);
        this.index = DOM.getChildIndex(this.parentNode, this.el);
    }

    link(el, exp, scope) {
        this.parentNode.removeChild(el);
        if (!exp) {
            var node = this.el.cloneNode(true);
            DOM.insertAfter(this.parentNode, node, this.index);
            this.rid = DOM.getAttributes(node, ["rid"])["rid"];
            this.el = node;
        }
    }

    update(exp) {
        var node = this.el,
            nodeClone = node.cloneNode(true);
        if (node && DOM.getChildIndex(this.parentNode, node) !== -1) {
            this.parentNode.removeChild(node);
        }
        if (!exp) {
            DOM.insertAfter(this.parentNode, nodeClone, this.index);
            this.rid = DOM.getAttributes(nodeClone, ["rid"])["rid"];
            this.el = nodeClone;
        }
    }

}

export default RElse;
