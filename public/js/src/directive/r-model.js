/**
 * r-model指令
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["tool", "event", "dirBase"], function (Tool, Event, dirBase) {
            return factory(root, Tool, Event, dirBase);
        });
    }

}(window, function (root, Tool, Event, dirBase, undefined) {

    function RModel(dirCfg) {
        dirBase.call(this, dirCfg);
        this.priority = 2;
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
                Event.addEvent(el, "keyup", function (ev) {
                    var target = ev.target;
                    var value = target.value;
                    var update = {};
                    update[this.exp] = value;
                    scope.update(update);
                }.bind(this));
            }
        },

        "update": function (val) {
            this.el.value = val;
        }
    };

    return {
        "name": "RModel",
        "priority": 2,
        "constructor": RModel
    };

}));
