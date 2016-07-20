/**
 * index.js
 * 编译模板(View:事件绑定/指定数据)
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([
            "tool",
            "dom",
            "event",
            "directive"
        ], function (Tool, Dom, Event, directive) {
            return factory(window, Tool, Dom, Event, directive);
        });
    }

}(window, function (root, Tool, Dom, Event, directive, undefined) {

    //  无需编译的节点
    var unCompileElems = ["html", "head", "meta", "link", "title", "object", "embed", "script"];

    //  rFor的"xxx in yyy"类型指令值
    var loopDirReg = /^\s*(.+)\s+in{1}\s+(.*?)\s*(\s+track\s+by\s+(.+)\s*)?$/;

    //  指令类型的正则
    var dirReg = /^r\-/;

    /**
     * 编译模块
     * @param el    根元素选择器
     * @constructor
     */
    function Compile(el) {
        this.bootstrap(el);
    }

    //  原型相关拓展
    Compile.prototype = {
        "constructor": Compile,

        /**
         * 启动
         * @param el    根元素选择器
         */
        "bootstrap": function (el) {
            this.roomElement = document.querySelector(el) || document.body;         //  根元素,后面缓存绑定r-controller的元素,并且指定相关作用域
            this.eleMap = {};                                                       //  元素map,每个元素作为el属性值存放在单独id的对象中
            this.directiveMap = {};                                                 //  指令map,调用map的时候,根据指令绑定属性值,遍历相关对象,减少循环次数
            this.compile();
        },

        /**
         * 数据发送变化,更新DOM之前的回调
         * @param key   数据对应的key
         * @param val   数据值
         */
        "beforeUpdate": function (key, val) {
        },

        /**
         * 数据发送变化,更新DOM
         * @param key   数据对应的key
         * @param val   数据值
         */
        "update": function (key, val) {
            this.directiveMap[key].map(function (dir) {
                //dir.directiveIns.link(dir.el, val, dir.scope);
            });
        },

        /**
         * 获取节点,过滤掉不编译的节点
         */
        "compile": function () {
            var childEles = Dom.getAllChildElements(this.roomElement);
            this.getAllDirectives(childEles);
        },

        /**
         * 获取所有标签上的指令
         * @param elList    DOMList
         * @returns {Array}
         */
        "getAllDirectives": function (elList) {
            var rootEle = this.roomElement,tagName, rid, pRid, attrRid, mapInfo, directives, pEleMap, pDirectives;
            if (!elList || !elList.length) {
                return [];
            }
            elList.forEach(function (el) {
                tagName = el.tagName.toLowerCase();
                if (!~(unCompileElems.indexOf(tagName))) {
                    rid = Tool.randomStr();
                    attrRid = Dom.getAttributes(el, "rid")["rid"];

                    //  之前没被编译过的元素
                    if (!attrRid) {
                        Dom.setAttributes(el, "rid", rid);

                        //  获取标签上的指令
                        directives = this.getDirectives(el);

                        //  存储到elMap中
                        if (directives.length) {
                            mapInfo = {
                                "el": el,
                                "directives": directives
                            };
                            this.eleMap[rid] = mapInfo;
                        }
                    }

                    //  遍历当前元素所有父元素
                    Dom.getParent(el, rootEle, function (parent) {
                        //  获取当前元素的父元素的rid属性,再根据它获取父元素在eleMap中的指令信息
                        pRid = Dom.getAttributes(parent, "rid")["rid"];
                        pEleMap = this.eleMap[pRid];

                        //  如果父元素上绑定了
                        if (pEleMap) {
                            pDirectives = pEleMap.directives;
                            if (pDirectives && pDirectives.length) {
                                pDirectives.forEach(function (dir) {
                                    //  当前父元素的指令中包含"r-for='xxx in yyy[.zzz]'"这种指令
                                    if (dir.directiveName === "RFor" && loopDirReg.test(dir.exp)) {

                                        //  放到父元素的子指令中去
                                        if (!pEleMap.childDir) {
                                            pEleMap.childDir = [];
                                        }
                                        pEleMap.childDir.push(mapInfo);

                                        //  配置该指令不需要第一次进行link
                                        this.eleMap[rid].config = {
                                            "parent": parent,
                                            "type": "RForAttr",
                                            "firstLink": false
                                        };
                                    }
                                }.bind(this));
                            }
                        }
                    }.bind(this));
                }
            }, this);
        },

        /**
         * 获取当前节点上的指令
         * @param el    当前节点
         */
        "getDirectives": function (el) {
            if (!Dom.isHTMLNode(el)) {
                return;
            }

            var tagAttrs = Tool.toArray(el.attributes),
                res = [],
                name,
                exp;

            //  遍历所有的标签属性
            tagAttrs.forEach(function (attr) {

                name = attr.name;
                exp = attr.value;

                //  过滤掉非"r-xxx[-yyy]"这种指令
                if (dirReg.test(name)) {
                    name = Tool.toCamelCase(name);

                    if (directive.hasOwnProperty(name)) {
                        res.push({
                            "directive": directive[name],
                            "directiveName": name,
                            "priority": directive[name].priority,
                            "exp": Tool.trim(exp)
                        });
                    }
                }
            }, this);

            //  绑定了多条指令,根据priority给指令排序(指定执行顺序)
            if (res.length > 1) {
                res.sort(function (prev, next) {
                    return prev.priority > next.priority;
                });
            }

            return res;
        },

        /**
         * 绑定指令
         * @param scope Scope类的实例
         */
        "link": function (scope) {
            var ele = this.eleMap;
            var depPare = false;
            var cEle, directives, dir, finalExp, directiveIns, exp, children, cDir, childDirMap;
            Object.keys(ele).forEach(function (key) {
                childDirMap = [];
                cEle = ele[key];
                if (!cEle.compiled) {
                    directives = cEle.directives;

                    //  ES5中Array.prototype.forEach不支持break,所以直接for循环,在遇到r-for的时候break该次循环
                    for (var i = 0, len = directives.length; i < len; i++) {
                        depPare = false;
                        dir = directives[i];
                        finalExp = dir.exp;

                        //  r-for指令
                        if (loopDirReg.test(dir.exp)) {
                            var execEd = loopDirReg.exec(dir.exp);
                            finalExp = execEd[2];
                        }

                        children = Tool.toArray(cEle.el.children);
                        if (children && children.length) {
                            children.forEach(function (child) {
                                var childDir = this.getDirectives(child);
                                if (childDir && childDir.length) {
                                    childDir.forEach(function (cDir) {
                                        childDirMap.push(Tool.merge(Tool.copy(cEle, true), {
                                            "el": child,
                                            "directives": [cDir]
                                        }, true));
                                    });
                                    cEle.childDirMap = childDirMap;
                                }
                            }.bind(this));
                        }

                        directiveIns = new dir.directive(cEle);
                        exp = scope.exec(finalExp);
                        directiveIns.link(cEle.el, exp, scope);

                        //  判断是否已经存在该指令对应的数组对象,没有就新建一个
                        if (!loopDirReg.test(dir.exp) && !depPare) {
                            if (!this.directiveMap.hasOwnProperty(dir.exp)) {
                                this.directiveMap[dir.exp] = [];
                            }

                            this.directiveMap[dir.exp].push({
                                "scope": scope,
                                "directiveIns": directiveIns,
                                "el": cEle.el
                            });

                        } else {
                            if (!this.directiveMap.hasOwnProperty(finalExp)) {
                                this.directiveMap[finalExp] = [];
                            }
                            this.directiveMap[finalExp].push({
                                "scope": scope,
                                "directiveIns": directiveIns,
                                "el": cEle.el
                            });
                        }

                        //  r-for指令
                        if (loopDirReg.test(dir.exp)) {
                            break;
                        }
                    }
                    this.eleMap[key].compiled = true;
                    this.eleMap[key].scope = scope;
                }
            }, this);
        }

    };

    return Compile;

}));

