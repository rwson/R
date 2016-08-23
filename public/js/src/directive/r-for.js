/**
 * r-for指令
 */

"use strict";

import Tool from "../lib/Tool";
import DOM from "../lib/DOM";
import DirectiveBase from "./direcrive-base";

class RFor extends DirectiveBase {

    constructor(dirCfg) {
        dirCfg.name = "RFor";
        super(dirCfg);
    }

    link(el, exp, scope) {
        this.parentNode.innerHTML = "";

        var execRes = this.scope.execDeep(this.finalExp, this.scope.data);
        this.originalData = execRes.result;
        this.updateExp = execRes.executeStr;

        if (this.originalData && this.originalData.length) {
            let fragement = Dom.createFragment(),
                directives = this.directives,
                elCloned, children, rid, childEl, childDir, childDirs, tDir, value, loopI, loopLen, loopChild;

            //  遍历list数据
            this.originalData.forEach(function (inExp) {

                //  当前元素的一个副本,及父元素
                elCloned = this.el.cloneNode(true);
                children = elCloned.children;

                rid = Tool.randomStr();
                Dom.setAttributes(elCloned, {
                    "rid": rid
                });

                //  子集元素指令
                childDir = this.childDir;

                //  如果子元素上存在且绑定了指令
                if (childDir && childDir.length) {

                    //  遍历子元素上的
                    childDir.forEach(function (dir) {

                        //  当前子元素的指令
                        childDirs = dir.directives;

                        if (childDirs && childDirs.length) {

                            //  同样保存当前子元素的一个副本
                            childEl = dir.el.cloneNode(true);

                            childDirs.forEach(function (cDir) {

                                loopI = 0;
                                loopLen = children.length;

                                for (; loopI < loopLen; loopI++) {

                                    loopChild = children.item(loopI);

                                    if (Dom.compareNodes(loopChild, childEl)) {

                                        rid = Tool.randomStr();
                                        Dom.setAttributes(childEl, {
                                            "rid": rid
                                        });

                                        dir.dataContext = inExp;
                                        dir.scope = this.scope;
                                        tDir = new cDir.directive(dir);
                                        tDir.el = childEl;
                                        tDir.link(tDir.el, dir.exp, this.scope, inExp);

                                        elCloned.replaceChild(childEl, loopChild);
                                    }
                                }

                            }, this);

                        }
                    }, this);
                }

                //  本身元素不止绑定了r-for一个指令
                if (directives.length > 1) {
                    directives.forEach(function (dir) {
                        if (dir.directiveName !== "RFor") {

                            dir.directives = directives;
                            dir.el = elCloned;
                            dir.scope = this.scope;
                            dir.dataContext = inExp;

                            tDir = new dir.directive(dir);

                            //  判断当前指令类型,事件类型就修改回调函数里面this指向
                            if (dir.dirType === "event") {
                                tDir.link(elCloned, dir.exp, this.scope, inExp);
                            } else {
                                tDir.link(elCloned, value, this.scope);
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
    }

    update() {
        let newData = this.scope.execByStr(this.updateExp, this.scope.data);
        if (this.originalData.length === 0) {
            this.link(this.el, newData, this.scope);
        } else {
            if (!Tool.isEqual(this.originalData, newData)) {
                this.link(this.el, newData, this.scope);
            }
        }
        this.originalData = newData;
    }

}

export default RFor;
