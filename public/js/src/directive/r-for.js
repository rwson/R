/**
 * r-for指令
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["tool", "dom"], function (Tool, Dom) {
            return factory(root, Tool, Dom);
        });
    }

}(window, function (root, Tool, Dom, undefined) {

    function RFor(dirCfg) {
        this.dirCfg = dirCfg;
        this.el = dirCfg.el;
        this.parent = this.el.parentNode;
        this.scope = dirCfg.scope;
        this.exp = dirCfg.directives[0].exp;
        this.directives = dirCfg.directives;
        this.childDirMap = dirCfg.childDirMap;
        return this;
    }

    RFor.prototype = {

        "constructor": RFor,

        "link": function (el, exp, scope) {
            this.parent.innerHTML = "";
            this.scope = this.scope || scope;
            this.dirCfg.scope = this.scope;
            var fragement = Dom.createFragment();
            var directives = this.directives;
            var children, childrenDirective, dirCfg, tDir, expArr, value;

            dirCfg = Tool.copy(this.dirCfg, true);

            if (exp.length) {
                exp.forEach(function (inExp) {

                    //  克隆当前节点
                    el = this.el.cloneNode(true);
                    children = this.childDirMap;
                    if (children.length) {
                        children.forEach(function (child) {
                            childrenDirective = child.directives;
                            if (childrenDirective && childrenDirective.length) {
                                childrenDirective.forEach(function (cDir) {

                                    console.log(cDir);

                                    dirCfg.exp = cDir.exp;
                                    tDir = new cDir.directive(dirCfg);
                                    expArr = cDir.exp.split(".").slice(1);
                                    value = dirCfg.scope.execDeep(inExp, expArr);

                                    //console.log(child);

                                    tDir.link(child.el, value, dirCfg.scope);
                                });
                            }
                        });
                    } else {
                        if (directives.length) {
                            directives.forEach(function (dir) {
                                //  directive中有多个,执行其他的
                                if (dir.directive !== this.constructor) {
                                    dirCfg.exp = dir.exp;
                                    tDir = new dir.directive(dirCfg);
                                    expArr = dir.exp.split(".").slice(1);
                                    value = dirCfg.scope.execDeep(inExp, expArr);
                                    tDir.link(el, value, dirCfg.scope);
                                }
                            }, this);
                        }
                    }
                    fragement.appendChild(el);
                }, this);
                this.parent.appendChild(fragement);
            }
        },

        "update": function (el, exp, scope) {

        }

    };

    return {
        "name": "RFor",
        "priority": 1,
        "constructor": RFor
    };

}));
