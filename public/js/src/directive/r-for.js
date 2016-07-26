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
        this.priority = 2;
        this.parentNode = this.el.parentNode;
        this.childDir = dirCfg.childDir;
        return this;
    }

    RFor.prototype = {

        "constructor": RFor,

        "link": function (el, exp, scope) {
            this.scope = this.scope || scope;
            this.parentNode.innerHTML = "";
            if (exp && exp.length) {
                var fragement = Dom.createFragment();
                var directives = this.directives;
                var elCloned, rid, children, childEl, childDir, childDirs, tDir, expArr, value, loopParent;

                //  遍历list数据
                exp.forEach(function (inExp) {

                    //  当前元素的一个副本,及父元素
                    elCloned = this.el.cloneNode(true);
                    rid = Tool.randomStr();
                    Dom.setAttributes(elCloned, {
                        "rid": rid
                    });
                    children = elCloned.children;

                    //  子集元素指令
                    childDir = this.childDir;

                    //  如果子元素上存在且绑定了指令
                    if (childDir && childDir.length) {

                        //  遍历子元素上的
                        childDir.forEach(function (dir) {

                            //  当前子元素的指令
                            childDirs = dir.directives;

                            if (childDirs && childDir.length) {


                                //  同样保存当前子元素的一个副本
                                childEl = dir.el.cloneNode(true);

                                if (childDirs.length === 1) {
                                    //  遍历子节点
                                    Dom.loopChild(elCloned, function (child, lowest) {
                                        if (Dom.compareNodes(child, childEl)) {
                                            rid = Tool.randomStr();

                                            //  重新给相关子元素设置rid属性
                                            Dom.setAttributes(child, {
                                                "rid": rid
                                            });

                                            loopParent = child.parentNode;

                                            //  遍历当前子元素的指令
                                            childDirs.forEach(function (cDir) {
                                                //  实例化指令
                                                tDir = new cDir.directive(dir);

                                                //  取得指令绑定是属性值
                                                expArr = cDir.exp.split(".").slice(1);
                                                value = scope.exec(cDir.exp) || scope.execDeep(inExp, expArr);

                                                //  判断当前指令类型,事件类型就修改回调函数里面this指向
                                                if (cDir.dirType === "event") {
                                                    tDir.link(child, value, this.scope, inExp);
                                                } else {
                                                    tDir.link(child, value, this.scope);
                                                }
                                            }, this);

                                            loopParent.replaceChild(child, child);
                                        }
                                    }, this);
                                } else {
                                    //  遍历子节点
                                    Dom.loopChild(elCloned, function (child, lowest) {
                                        if (Dom.compareNodes(child, childEl)) {
                                            rid = Tool.randomStr();

                                            //  重新给相关子元素设置rid属性
                                            Dom.setAttributes(child, {
                                                "rid": rid
                                            });

                                            loopParent = child.parentNode;

                                            childDirs.forEach(function (cDir) {
                                                //  实例化指令
                                                tDir = new cDir.directive(dir);

                                                //  取得指令绑定是属性值
                                                expArr = cDir.exp.split(".").slice(1);
                                                value = scope.exec(cDir.exp) || scope.execDeep(inExp, expArr);

                                                //  判断当前指令类型,事件类型就修改回调函数里面this指向
                                                if (cDir.dirType === "event") {
                                                    tDir.link(child, value, this.scope, inExp);
                                                } else {
                                                    tDir.link(child, value, this.scope);
                                                }
                                            }, this);

                                            loopParent.replaceChild(child, child);
                                        }
                                    }, this);
                                }
                            }
                        }, this);
                    }

                    //  把当前循环元素添加到文档片段中
                    fragement.appendChild(elCloned);
                }, this);
                //  将文档片段添加到父元素
                this.parentNode.appendChild(fragement);
            }
        },

        "update": function (val) {
            this.link(this.el, val, this.scope);
        }
    };

    return {
        "name": "RFor",
        "type": "dom",
        "constructor": RFor
    };

}));
