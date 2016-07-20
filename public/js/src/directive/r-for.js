/**
 * r-for指令
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["tool", "dom", "dirBase"], function (Tool, Dom, dirBase) {
            return factory(root, Tool, Dom, dirBase);
        });
    }

}(window, function (root, Tool, Dom, dirBase, undefined) {

    function RFor(dirCfg) {
        dirBase.call(this, dirCfg);
        this.priority = 1;
        this.parent = this.el.parentNode;
        this.childDir = dirCfg.childDir;
        return this;
    }

    RFor.prototype = {

        "constructor": RFor,

        "link": function (el, exp, scope) {
            this.scope = this.scope || scope;
            this.parent.innerHTML = "";
            if (exp && exp.length) {
                var fragement = Dom.createFragment();
                var directives = this.directives;
                var el, rid, children, childEl, childDir, childDirs, tDir, expArr, value;

                //  遍历list
                exp.forEach(function (inExp) {
                    el = this.el.cloneNode(true);
                    rid = Tool.randomStr();
                    Dom.setAttributes(el ,{
                        "rid": rid
                    });
                    childDir = this.childDir;

                    if (childDir && childDir.length) {
                        children = el.children;

                        //console.log(children);

                        childDir.forEach(function (dir) {
                            childDirs = dir.directives;
                            if (childDirs && childDir.length) {
                                childDirs.forEach(function (cDir) {
                                    tDir = new cDir.directive(dir);
                                    expArr = cDir.exp.split(".").slice(1);
                                    value = scope.execDeep(inExp, expArr);
                                    rid = Tool.randomStr();
                                    Dom.setAttributes(tDir.el ,{
                                        "rid": rid
                                    });
                                    tDir.link(tDir.el, value, this.scope);
                                    el.appendChild(tDir.el);
                                }, this);
                            }
                        }, this);

                    }
                    fragement.appendChild(el);
                }, this);
                this.parent.appendChild(fragement);
            }
        },

        "update": function (val) {
            this.link(this.el, val, this.scope);
        }

    };

    return {
        "name": "RFor",
        "priority": 1,
        "constructor": RFor
    };

}));
