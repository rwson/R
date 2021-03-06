/**
 * r-if指令
 */

"use strict";

import DOM from "../lib/DOM";
import DirectiveBase from "./direcrive-base";

class RIf extends DirectiveBase {

    constructor(dirCfg) {
        dirCfg.name = "RIf";
        super(dirCfg);
    }

    link(el, exp, scope) {
        this.parentNode.removeChild(el);
        if (exp) {
            var node = this.el.cloneNode(true);
            DOM.insertAfter(this.parentNode, node, this.index);
            this.rid = DOM.getAttributes(node, ["rid"])["rid"];
            this.el = node;
        }
    }

    update(exp) {
        let node = this.el,
            nodeClone = node.cloneNode(true);
        if (node && Dom.getChildIndex(this.parentNode, node) !== -1) {
            this.parentNode.removeChild(node);
        }
        if (exp) {
            Dom.insertAfter(this.parentNode, nodeClone, this.index);
            this.rid = Dom.getAttributes(nodeClone, ["rid"])["rid"];
            this.el = nodeClone;
        }
    }

}

export default RIf;
