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

    //  ngFor的"xxx in yyy"类型指令值
    var loopDir = /^\s*(.+)\s+in{1}\s+(.*?)\s*(\s+track\s+by\s+(.+)\s*)?$/;

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
                dir.directiveIns.link(dir.el, val, dir.scope);
            });
        },

        /**
         * 获取节点,过滤掉不编译的节点
         */
        "compile": function () {
            var eles = Tool.toArray(this.roomElement.getElementsByTagName("*"));

            //  便于过滤后的节点列表
            eles.forEach(function (el) {
                if (!~(unCompileElems.indexOf(el.tagName.toLowerCase()))) {
                    var rid = Tool.randomStr();
                    var attrRid = Dom.getAttributes(el, "rid").rid;
                    var directives = this.getDirectives(el);
                    if (directives && directives.length) {
                        if (!attrRid) {
                            Dom.setAttributes({
                                "rid": rid
                            });

                            this.eleMap[rid] = {
                                "el": el,
                                "directives": directives
                            };
                        }
                    }
                }
            }, this);
        },

        /**
         * 获取当前HTML节点上的指令
         * @param el    当前节点
         */
        "getDirectives": function (el) {
            if (!Dom.isHTMLNode(el)) {
                return;
            }

            var attrs = Tool.toArray(el.attributes);
            var res = [];
            //  将指令的r-xxx写法转换成rXxx写法
            attrs.forEach(function (attr) {
                var name = attr.name;
                var exp = attr.value;

                name = name.replace(/[^\b-]{1,90}/g, function (word) {
                    return word.substring(0, 1).toUpperCase() + word.substring(1).replace("-", "");
                }).replace(/\-/g, "");

                if (directive.hasOwnProperty(name)) {
                    res.push({
                        "directive": directive[name],
                        "priority": directive[name].priority,
                        "exp": Tool.trim(exp)
                    });
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
                        if (loopDir.test(dir.exp)) {
                            var execEd = loopDir.exec(dir.exp);
                            finalExp = execEd[2];
                        }

                        children = Tool.toArray(cEle.el.children);
                        if(children && children.length) {
                            children.forEach(function(child) {
                                var childDir = this.getDirectives(child);
                                if(childDir && childDir.length) {
                                    childDir.forEach(function(cDir) {
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
                        if (!loopDir.test(dir.exp) && !depPare) {
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
                        if (loopDir.test(dir.exp)) {
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

