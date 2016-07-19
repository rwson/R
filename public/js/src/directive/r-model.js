/**
 * r-model指令
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["tool", "event"], function (Tool, Event) {
            return factory(root, Tool, Event);
        });
    }

}(window, function (root, Tool, Event, undefined) {

    function RModel(dirCfg) {
        this.el = dirCfg.el;
        this.scope = dirCfg.scope;
        this.exp = dirCfg.directives[0].exp;
        return this;
    }

    RModel.prototype = {

        "constructor": RModel,

        "link": function (el, exp, scope) {
            //  修正scope
            this.scope = this.scope || scope;
            el.value = exp;
            if (el.tagName.toLowerCase() === "input" && el.type === "text") {
                Event.removeEvent(el, ["keydown", "keyup", "change"]);
                Event.addEvent(el, "keyup", function(ev) {
                    var target = ev.target;
                    var value = target.value;
                    var update = {};
                    update[this.exp] = value;
                    this.scope.update(update);
                }.bind(this));
            }
        }
    };

    return {
        "name": "RModel",
        "priority": 2,
        "constructor": RModel
    };

}));
