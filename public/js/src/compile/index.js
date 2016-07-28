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

    //  常用的条件语句类型
    var equalDirReg = /\s+(==|===|>|>=|<|<=|!=|!==)\s+/;

    //  提取条件语句中的条件
    var equalReg = /(==|===|>|>=|<|<=|!=|!==)/;

    //  指令类型的正则
    var dirReg = /^r\-/;

    /**
     * 编译模块
     * @param el    根元素选择器
     * @constructor
     */
    function Compile(el) {
        this.uId = Tool.randomStr();
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
            this.rootElement = el || document.body;     //  根元素,后面缓存绑定r-controller的元素,并且指定相关作用域
            this.eleMap = {};                           //  元素map,每个元素作为el属性值存放在单独id的对象中
            this.directiveMap = {};                     //  指令map,调用map的时候,根据指令绑定属性值,遍历相关对象(根据key值定位),减少循环次数
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
            var dirMap = this.directiveMap[key];
            if (dirMap && dirMap.length) {
                dirMap.forEach(function (dir) {
                    dir.directiveIns.update(val);
                });
            }
        },

        /**
         * 获取节点,过滤掉不编译的节点
         */
        "compile": function () {
            var childEles = Dom.getAllChildElements(this.rootElement);
            this.getAllDirectives(childEles);
        },

        /**
         * 获取所有标签上的指令
         * @param elList    DOMList
         * @returns {Array}
         */
        "getAllDirectives": function (elList) {

            var rootEle = this.rootElement,
                ctrlName = Dom.getAttributes(rootEle, "r-controller")["r-controller"],
                tagName, rid, pRid, attrRid, mapInfo, directives, pEleMap, pDirectives;
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
                        Dom.setAttributes(el, {
                            "rid": rid
                        });

                        //  获取标签上的指令
                        directives = this.getDirectives(el);

                        //  存储到elMap中
                        if (directives.length) {
                            mapInfo = {
                                "ctrlName": this.ctrlName,
                                "el": el,
                                "firstLink": true,
                                "directives": directives
                            };
                            this.eleMap[rid] = mapInfo;
                        }
                    }

                    //  遍历当前元素所有父元素
                    Dom.getParent(el, rootEle, function (parent) {

                        //console.log("取到一个父元素...");
                        //console.log(parent);

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
                                        this.eleMap[rid] = Tool.merge(mapInfo, {
                                            "parent": parent,
                                            "type": "RForAttr",
                                            "firstLink": false
                                        }, true);
                                    }
                                }.bind(this));
                            }
                        }
                    }.bind(this));

                    //console.groupEnd();
                }
            }, this);
        },

        /**
         * 获取当前节点上的指令
         * @param el    当前节点
         */
        "getDirectives": function (el) {
            var tagAttrs = Dom.getDOMAttrs(el),
                res = [],
                dirClass,name, exp;

            if (!Dom.isHTMLNode(el)) {
                return;
            }

            //  遍历所有的标签属性
            tagAttrs.forEach(function (attr) {

                name = attr.name;
                exp = attr.value;

                //  过滤掉非"r-xxx[-yyy]"这种指令
                if (dirReg.test(name)) {
                    name = Tool.toCamelCase(name);

                    dirClass = directive[name];

                    //  处理自定义指令存放在一个对象中的
                    if(!Tool.isType(dirClass, "function") && Tool.isType(dirClass, "object")) {
                        dirClass = dirClass.constructor;
                    }

                    if (directive.hasOwnProperty(name)) {
                        res.push({
                            "directive": dirClass,
                            "directiveName": name,
                            "dirType": directive[name].dirType,
                            "exp": Tool.trim(exp),
                            "el": el
                        });
                    }
                }
            }, this);

            return res;
        },

        /**
         * 绑定指令
         * @param scope Scope类的实例
         */
        "link": function (scope) {
            this.compile();

            var ele = this.eleMap, mapKeys = Object.keys(ele),
                cEle, directives, dir, finalExp, directiveIns, exp, execEd, childDirMap, splitDir, equalType;

            mapKeys.forEach(function (key) {
                childDirMap = [];
                cEle = ele[key];

                //  过滤掉已经编译过的元素
                if (!cEle.compiled) {
                    directives = cEle.directives;

                    //  ES5中Array.prototype.forEach不支持break,所以直接for循环,在遇到r-for的时候break该次循环
                    for (var i = 0, len = directives.length; i < len; i++) {
                        dir = directives[i];
                        finalExp = dir.exp;

                        //  r-for指令
                        if (loopDirReg.test(finalExp)) {
                            execEd = loopDirReg.exec(finalExp);
                            finalExp = execEd[2];
                        }

                        //  表达式的值为判断
                        if (equalDirReg.test(finalExp)) {
                            equalType = equalDirReg.exec(finalExp)[0];
                            splitDir = finalExp.split(equalReg);
                            finalExp = Tool.trim(splitDir[0]);
                        }

                        directiveIns = new dir.directive(cEle);

                        exp = scope.exec(finalExp);

                        //  cEle中的firstLink是true,说明没有嵌套在r-for中
                        if (cEle.firstLink) {

                            //  表达式的值为判断
                            if (equalDirReg.test(dir.exp)) {
                                splitDir[0] = exp ? "" + exp : finalExp;
                                exp = Tool.buildFunction("return " + splitDir.join("") + ";");
                            }

                            directiveIns.link(cEle.el, exp, scope);

                            //  判断是否已经存在该指令对应的数组对象,没有就新建一个
                            if (!this.directiveMap.hasOwnProperty(finalExp)) {
                                this.directiveMap[finalExp] = [];
                            }

                            //  缓存到相关key的数组中,便于update的时候调用
                            this.directiveMap[finalExp].push({
                                "scope": scope,
                                "directiveIns": directiveIns,
                                "el": cEle.el
                            });
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

