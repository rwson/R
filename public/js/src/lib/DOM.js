/***************
 * DOM操作模块
 * *************/

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["tool"], function (Tool) {
            return factory(window, Tool);
        });
    }

}(window, function (root, Tool, undefined) {

    var doc = document;

    var Dom = {

        /**
         * 获取指定元素下所有的子元素并且转换成数组
         * @param context   指定的元素
         * @returns {*|Array.<T>}
         */
        "getAllChildElements": function (context) {
            return Tool.toArray((context || doc).getElementsByTagName("*"));
        },

        /**
         * 根据rid属性获取相关元素
         * @param rid       元素的rid
         * @param context   查找的上下文对象
         * @returns {null|HTMLDOMElement}
         */
        "getElementByRid": function (rid, context) {
            if (!rid) {
                return null;
            }
            return (context || doc).querySelector("[rid='" + rid + "']");
        },

        /**
         * 创建一个dom片段
         * @returns {DocumentFragment}
         */
        "createFragment": function () {
            return doc.createDocumentFragment();
        },

        /**
         * 把一个DOM元素转换成DOM片段
         * @param el    被转换的元素
         * @returns {*|DocumentFragment}
         */
        "nodeToFragement": function (el) {
            var child;
            var fragment = this.createFragment();
            while (child = el.firstChild) {
                fragment.appendChild(child);
            }
            return fragment;
        },

        /**
         * 判断一个节点对象是否为DOM节点
         * @param el    被判断的对象
         * @returns {*|boolean}
         */
        "isHTMLNode": function (el) {
            return el && el.nodeType === 1;
        },

        /**
         * 递归获取当前节点的父节点,直到指定的元素
         * @param el            被获取父节点的元素
         * @param top           限制最顶层的元素
         * @param callback      获取成功对应的回调函数
         */
        "getParent": function (el, top, callback) {
            if(!el) {
                return;
            }
            var parent = el.parentNode;
            callback(parent);
            if(this.isHTMLNode(el) && el !== top) {
                this.getParent(parent, top, callback);
            }
        },

        /**
         * 获取元素上的标签属性,并且转换成数组返回
         * @param el    被获取属性的元素
         * @returns {*|Array.<T>}
         */
        "getDOMAttrs": function (el) {
            return Tool.toArray(el.attributes);
        },

        /**
         * 给元素追加class样式类
         * @param el            目标元素
         * @param classList     需要追加的类(String:"xxx"/"xxx yyy" | Array<String>)
         */
        "addClass": function (el, classList) {
            var classEs = el.classList;
            if (Tool.isType(classList, "String")) {
                if (~classList.indexOf(" ")) {
                    classList = classList.split(" ");
                } else {
                    classList = [classList];
                }
            }
            if (classList.length) {
                classList.forEach(function (item) {
                    if (!classEs.contains(item)) {
                        el.classList.add(item);
                    }
                    classEs = el.classList;
                });
            }
        },

        /**
         * 给元素追加class样式类
         * @param el            目标元素
         * @param classList     需要删除的类(String:"xxx"/"xxx yyy" | Array<String>)
         */
        "removeClass": function (el, classList) {
            var classEs = el.classList;
            if (Tool.isType(classList, "String")) {
                if (~classList.indexOf(" ")) {
                    classList = classList.split(" ");
                } else {
                    classList = [classList];
                }
            }
            if (classList.length) {
                classList.forEach(function (item) {
                    if (classEs.contains(item)) {
                        el.classList.remove(item);
                    }
                    classEs = el.classList;
                });
            }
        },

        /**
         * 给元素设置样式
         * @param el        目标元素
         * @param attr      样式名(String/Object)
         * @param value     样式值[,String]
         */
        "setStyle": function (el, attr, value) {
            var styleObj = {};
            var styleArr = [];
            if (arguments.length === 2) {
                styleObj = attr;
            } else if (arguments.length === 3) {
                styleObj[attr] = value;
            }
            styleArr = Object.keys(styleObj).map(function (item) {
                return item + ":" + styleObj[item];
            });
            el.style.cssText += ";" + styleArr.join(";");
        },

        /**
         * 设置元素的标签属性
         * @param el        目标元素
         * @param attr      属性名(String/Object)
         * @param value     属性值([,String])
         */
        "setAttributes": function (el, attr, value) {
            var attrObj = {};
            if (arguments.length === 2) {
                attrObj = attr;
            } else if (arguments.length === 3) {
                attrObj[attr] = value;
            }
            Object.keys(attrObj).forEach(function (item) {
                el.setAttribute(item, attrObj[item]);
                //  确保设置成功
                if (el[item] !== attrObj[item]) {
                    el[item] = attrObj[item];
                }
            });
        },

        /**
         * 获取的标签属性
         * @param el        目标元素
         * @param attrs     属性名(String/Array<String>)
         * @returns {{}|Object}
         */
        "getAttributes": function (el, attrs) {
            var attrList = [];
            var output = {};
            if (Tool.isType(attrs, "String")) {
                attrList = [attrs];
            } else if (Tool.isType(attrs, "Array")) {
                attrList = attrs;
            }
            attrList.forEach(function (item) {
                var val = el.getAttribute(item);
                if (val) {
                    output[item] = val;
                }
            });
            return output;
        }
    };

    return Dom;

}));
