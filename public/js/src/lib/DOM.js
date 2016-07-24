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
         * 根据相关controller的名称获取元素
         * @param ctrlName  controller的名称
         * @param context   查找的上下文对象
         * @returns {null|HTMLDOMElement}
         */
        "getCtrlElement": function (ctrlName, context) {
            if (!ctrlName) {
                return null;
            }
            if (this.getAttributes(context, "r-controller")["r-controller"]) {
                return context;
            }
            return (context || doc).querySelector("[r-controller='" + ctrlName + "']");
        },

        /**
         *
         * 比对两个HTML节点是否相等
         * @param node1     第一个节点
         * @param node2     第二个节点
         * @returns {boolean}
         */
        "compareNodes": function (node1, node2) {
            var node1Clone, node2Clone;
            if (arguments.length < 2) {
                return false;
            }
            //  对两个节点的副本进行比较
            node1Clone = node1.cloneNode(true);
            node2Clone = node2.cloneNode(true);

            //  不比较rid属性
            this.setAttributes(node1Clone, "rid", "");
            this.setAttributes(node2Clone, "rid", "");

            return node1Clone.outerHTML === node2Clone.outerHTML;
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
            if (!el) {
                return;
            }
            var parent = el.parentNode;
            callback(parent);
            if (this.isHTMLNode(el) && this.compareNodes(top, parent)) {
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
        },

        /**
         * 判断元素是否隐藏
         * @param el    元素
         * @returns {boolean}
         */
        "isHide": function (el) {
            return el.style.display === "none";
        },

        /**
         * 判断一个元素是否存在
         * @param el    元素
         * @returns {boolean}
         */
        "isExist": function (el) {
            var rid;
            if (!el) {
                return false;
            }
            rid = this.getAttributes(el, ["rid"])["rid"];
            return this.getElementByRid(rid) !== null;
        },

        /**
         * 获取当前元素在其父元素中的位置
         * @param parent    父元素
         * @param child     子元素
         * @returns {number}
         */
        "getChildIndex": function (parent, child) {
            var childList = Tool.toArray(parent.children);
            var res = -1;
            childList.forEach(function (el, index) {
                if (this.compareNodes(el, child)) {
                    res = index;
                }
            }, this);
            return res;
        },

        /**
         * insertAfter方法
         * @param parent    父节点
         * @param el        要插入的子节点
         * @param index     插入的位置
         */
        "insertAfter": function (parent, el, index) {
            var childList = parent.children;
            if(index >= childList) {
                parent.appendChild(el);
            } else {
                parent.insertBefore(el, childList.item(index));
            }
        }

    };

    return Dom;

}));
