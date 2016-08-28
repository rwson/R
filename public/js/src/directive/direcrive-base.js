/**
 * 指令基类,子类只继承构造函数
 */

"use strict";

import DOM from "../lib/DOM";

class DirectiveBase{

    /**
     * 指令基类
     * @param dir   指令相关配置
     * @constructor
     */
    constructor(dir){
        this.el = dir.el;
        this.parentNode = this.el.parentNode;
        this.directives = dir.directives;
        this.scope = dir.scope;
        this.dataContext = dir.dataContext;
        this.rid = DOM.getAttributes(this.el, ["rid"])["rid"];
        this.pRid = DOM.getAttributes(this.parentNode, ["rid"])["rid"];
        this.priority = 0;
        this.exp = dir.exp;
        this.updateExp = "";
        this.finalExp = this.exp;
        this.originalData = null;
        this.bindFn = null;
        if (dir.name) {
            let curDirective = this.directives.filter(function (directive) {
                return directive.directiveName === dir.name;
            });
            if (curDirective.length) {
                this.exp = curDirective[0]["exp"];
                this.finalExp = this.exp;

                //  RFor指令的特殊处理
                if (dir.name === "RFor") {
                    this.finalExp = this.exp.split(" ")[2];
                    this.childDir = dir.childDir || [];
                }
            }
        }
    }

}

export default DirectiveBase;
