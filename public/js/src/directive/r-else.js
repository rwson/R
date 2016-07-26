/**
 * r-if指令
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["tool", "event", "dom", "dirBase"], function (Tool, Event, dom, dirBase) {
            return factory(root, Tool, Event, dom, dirBase);
        });
    }

}(window, function (root, Tool, Event, Dom, dirBase, undefined) {

    function RElse(dirCfg) {
        dirBase.call(this, dirCfg);
        this.index = Dom.getChildIndex(this.parentNode, this.el);
    }

    RElse.prototype = {

        "constructor": RElse,

        "link": function (el, exp, scope) {
            this.parentNode.removeChild(el);
            if (!exp) {
                var node = this.el.cloneNode(true);
                Dom.insertAfter(this.parentNode, node, this.index);
                this.rid = Dom.getAttributes(node, ["rid"])["rid"];
                this.el = node;
            }
        },

        "update": function (exp) {
            var node = this.el,
                nodeClone = node.cloneNode(true);
            if (node && Dom.getChildIndex(this.parentNode, node) !== -1) {
                this.parentNode.removeChild(node);
            }
            if (!exp) {
                Dom.insertAfter(this.parentNode, nodeClone, this.index);
                this.rid = Dom.getAttributes(nodeClone, ["rid"])["rid"];
                this.el = nodeClone;
            }
        }

    };

    return {
        "name": "RElse",
        "type": "control",
        "constructor": RElse
    };

}));


