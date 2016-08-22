/**
 * index.js
 * 编译模板(View:事件绑定/指定数据)
 */

"use strict";

import Tool from "../lib/Tool";
import DOM from "../lib/DOM";
import * as Directive from "../directive/index";



//  无需编译的节点
const unCompileElems = ["html", "head", "meta", "link", "title", "object", "embed", "script"];

//  rFor的"xxx in yyy"类型指令值(angularjs)
const loopDirReg = /^\s*(.+)\s+in{1}\s+(.*?)\s*(\s+track\s+by\s+(.+)\s*)?$/;

//  常用的条件语句类型
const conditionReg = /((\!)?\=+|>(\=)?|<(\=)?|\|\||\&\&)/g;

//  三目运算符(a ? 'b' : c)
const trinocularExpReg = /[\w\W]+\?[\w\W]+\:[\w\W]+/;

//  指令类型的正则
const dirReg = /^r\-/;

class Compile {

    constructor(el) {
        this.uId = Tool.randomStr();
        this.bootstrap(el);
    }

    /**
     * 启动
     * @param el    根元素选择器
     */
    bootstrap(el) {
        this.rootElement = el || document.body; //  根元素,后面缓存绑定r-controller的元素,并且指定相关作用域
        this.eleMap = {};                       //  元素map,每个元素作为el属性值存放在单独id的对象中
        this.directiveMap = {};                 //  指令map,调用map的时候,根据指令绑定属性值,遍历相关对象(根据key值定位),减少循环次数
    }


    /**
     * 数据发送变化,更新DOM之前的回调
     * @param key   数据对应的key
     * @param val   数据值
     */
    beforeUpdate(key, val) {
    }


    /**
     * 数据发送变化,更新DOM
     * @param key   数据对应的key
     * @param val   数据值
     */
    update(key, val) {
        let dirMap = this.directiveMap[key];
        if (dirMap && dirMap.length) {
            dirMap.forEach((dir) => {
                dir.directiveIns.update(val);
            });
        }
    }

    /**
     * 获取节点,过滤掉不编译的节点
     */
    compile() {
        let childEles = DOM.getAllChildElements(this.rootElement);
        this.getAllDirectives(childEles);
    }

    /**
     * 获取所有标签上的指令
     * @param elList    DOMList
     * @returns {Array}
     */
    getAllDirectives(elList) {
        let rootEle = this.rootElement,
            ctrlName = DOM.getAttributes(rootEle, "r-controller")["r-controller"],
            tagName, rid, pRid, attrRid, mapInfo, directives, pEleMap, pDirectives;

        if (!elList || !elList.length) {
            return [];
        }

        elList.forEach((el) => {
            tagName = el.tagName.toLowerCase();
            if (!~(unCompileElems.indexOf(tagName))) {

                rid = Tool.randomStr();
                attrRid = DOM.getAttributes(el, "rid")["rid"];

                //  之前没被编译过的元素
                if (!attrRid) {
                    DOM.setAttributes(el, {
                        "rid": rid
                    });

                    //  获取标签上的指令
                    directives = this.getDirectives(el);

                    //  存储到elMap中
                    if (directives.length) {
                        mapInfo = {
                            "ctrlName": ctrlName,
                            "el": el,
                            "firstLink": true,
                            "directives": directives
                        };
                        this.eleMap[rid] = mapInfo;
                    }
                }

                //  遍历当前元素所有父元素
                DOM.getParent(el, rootEle, (parent) => {

                    //  获取当前元素的父元素的rid属性,再根据它获取父元素在eleMap中的指令信息
                    pRid = DOM.getAttributes(parent, "rid")["rid"];
                    pEleMap = this.eleMap[pRid];

                    //  如果父元素上绑定了
                    if (pEleMap) {
                        pDirectives = pEleMap.directives;
                        if (pDirectives && pDirectives.length) {
                            pDirectives.forEach(function (dir) {
                                //  当前父元素的指令中包含"r-for='xxx in yyy[.zzz]'"这种指令
                                if (dir.directiveName === "RFor" && loopDirReg.test(dir.exp)) {

                                    //  组织RFor子元素绑定指令的指令表达式
                                    if (mapInfo.directives) {
                                        mapInfo.directives = mapInfo.directives.map((mDir) => {
                                            mDir.exp = mDir.exp.split(".").slice(1).join(".");
                                            return mDir;
                                        });
                                    }

                                    //  放到父元素的子指令中去
                                    if (!pEleMap.childDir) {
                                        pEleMap.childDir = [];
                                    }
                                    pEleMap.childDir.push(mapInfo);

                                    //  配置该指令不需要第一次进行link
                                    this.eleMap[rid] = Tool.merge(mapInfo, {
                                        "parent": parent,
                                        "type": "RForAttr",
                                        "firstLink": false
                                    }, true);
                                }
                            });
                        }
                    }
                }, this);
            }
        });
    }

    /**
     * 获取当前节点上的指令
     * @param el    当前节点
     */
    getDirectives(el) {
        if (!DOM.isHTMLNode(el)) {
            return;
        }

        var tagAttrs = DOM.getDOMAttrs(el),
            res = [],
            dirClass, name, exp, isContainRFor;

        //  遍历所有的标签属性
        tagAttrs.forEach((attr) => {

            name = attr.name;
            exp = attr.value;

            //  过滤掉非"r-xxx[-yyy]"这种指令
            if (dirReg.test(name)) {
                name = Tool.toCamelCase(name);

                if (name === "RFor") {
                    isContainRFor = true;
                }

                dirClass = Directive[name];

                //  处理自定义指令存放在一个对象中的
                if (!Tool.isType(dirClass, "function") && Tool.isType(dirClass, "object")) {
                    dirClass = dirClass.constructor;
                }

                if (Directive.hasOwnProperty(name)) {
                    res.push({
                        "directive": dirClass,
                        "directiveName": name,
                        "dirType": Directive[name].dirType,
                        "exp": Tool.trim(exp),
                        "el": el
                    });
                }
            }
        }, this);

        if (res.length > 1) {
            res = res.map(function (item) {
                if (isContainRFor && item.directiveName !== "RFor") {
                    item.exp = item.exp.split(".").slice(1).join(".");
                    item.type = "RForAttr";
                }
                return item;
            });
        }

        /**
         * 返回根据优先级排序后的指令数组
         * @type {Array.<T>}
         */
        return res.length ? res.sort(function (a, b) {
            return a.priority > b.priority;
        }) : [];
    }

    /**
     * 绑定指令
     * @param scope Scope类的实例
     */
    link(scope) {
        this.compile();

        let ele = this.eleMap,
            mapKeys = Object.keys(ele),
            cEle, directives, dir, finalExp, directiveIns, childDirMap, splitDir;

        mapKeys.forEach(function (key) {
            childDirMap = [];
            cEle = ele[key];

            //  过滤掉已经编译过的元素
            if (!cEle.compiled && !Tool.isEqual(cEle.type, "RForAttr")) {
                directives = cEle.directives;
                cEle.scope = scope;

                //  ES5中Array.prototype.forEach不支持break,所以直接for循环,在遇到r-for的时候break该次循环
                for (let i = 0, len = directives.length; i < len; i++) {
                    dir = directives[i];

                    //  cEle中的firstLink是true,说明没有嵌套在r-for中
                    if (cEle.firstLink) {

                        directiveIns = new dir.directive(cEle);

                        directiveIns.link(cEle.el, dir.exp, scope);

                        finalExp = dir.exp;

                        //  RFor指令
                        if (loopDirReg.test(finalExp)) {
                            finalExp = Tool.trim(finalExp.split(" ")[2]);
                        }

                        //  条件判断语句
                        splitDir = finalExp.match(conditionReg);
                        if (splitDir) {
                            finalExp = Tool.trim(finalExp.split(splitDir[0])[0]);
                        }

                        if (trinocularExpReg) {
                            finalExp = Tool.trim(finalExp.split("?")[0]);
                        }

                        //  判断是否已经存在该指令对应的数组对象,没有就新建一个
                        if (!this.directiveMap.hasOwnProperty(finalExp)) {
                            this.directiveMap[finalExp] = [];
                        }

                        //  缓存到相关key的数组中,便于update的时候调用
                        this.directiveMap[finalExp].push({
                            "directiveIns": directiveIns
                        });
                    }
                }

                this.eleMap[key].compiled = true;
                this.eleMap[key].scope = scope;
            }
        }, this);
    }

}

export default Compile;

