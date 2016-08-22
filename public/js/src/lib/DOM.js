/***************
 * DOM操作模块
 * *************/

"use strict";

import  Tool from "./Tool";

const doc = document;

class DOM {

    constructor() {

    }

    /**
     * 获取指定元素下所有的子元素并且转换成数组
     * @param context   指定的元素
     * @returns {*|Array.<T>}
     */
    static getAllChildElements(context) {
        return Tool.toArray((context || doc).getElementsByTagName("*"));
    }


    /**
     * 根据rid属性获取相关元素
     * @param rid       元素的rid
     * @param context   查找的上下文对象
     * @returns {null|HTMLDOMElement}
     */
    static getElementByRid(rid, context) {
        if (!rid) {
            return null;
        }
        return (context || doc).querySelector("[rid='" + rid + "']");
    }


    /**
     * 根据相关controller的名称获取元素
     * @param ctrlName  controller的名称
     * @param context   查找的上下文对象
     * @returns {null|HTMLDOMElement}
     */
    static getCtrlElement(ctrlName, context) {
        if (!ctrlName) {
            return null;
        }
        if (this.getAttributes(context, "r-controller")["r-controller"]) {
            return context;
        }
        return (context || doc).querySelector("[r-controller='" + ctrlName + "']");
    }


    /**
     *
     * 比对两个HTML节点是否相等
     * @param node1     第一个节点
     * @param node2     第二个节点
     * @returns {boolean}
     */
    static compareNodes(node1, node2) {
        let node1Clone, node2Clone;
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
    }


    /**
     * 创建一个dom片段
     * @returns {DocumentFragment}
     */
    static createFragment() {
        return doc.createDocumentFragment();
    }

    /**
     * 把一个DOM元素转换成DOM片段
     * @param el    被转换的元素
     * @returns {*|DocumentFragment}
     */
    static nodeToFragement(el) {
        let fragment = this.createFragment(), child;
        while (child = el.firstChild) {
            fragment.appendChild(child);
        }
        return fragment;
    }

    /**
     * 判断一个节点对象是否为DOM节点
     * @param el    被判断的对象
     * @returns {*|boolean}
     */
    static isHTMLNode(el) {
        return el && el.nodeType === 1;
    }

    /**
     * 递归获取当前节点的父节点,直到指定的元素
     * @param el            被获取父节点的元素
     * @param top           限制最顶层的元素
     * @param callback      获取成功对应的回调函数
     */
    static getParent(el, top, callback) {
        if (!el) {
            return;
        }
        let parent = el.parentNode;
        callback(parent);

        if (this.isHTMLNode(el) && this.isHTMLNode(parent) && !this.compareNodes(top, parent)) {
            this.getParent(parent, top, callback);
        }
    }

    /**
     * 递归遍历一个树子元素
     * @param node      根节点
     * @param callback  回调函数
     * @param context   回调函数里面this指向
     */
    static loopChild(node, callback, context) {
        context = context || root;
        let child = node.children, isLowest, grandChild, loopI, loopLen;
        if (child.length) {
            loopI = 0;
            loopLen = child.length;
            for (; loopI < loopLen; loopI++) {
                grandChild = child.item(loopI).children;
                isLowest = grandChild.length === 0;
                callback.call(context, child.item(loopI), isLowest);
                if (!isLowest) {
                    this.loopChild(child.item(loopI), callback, context);
                }
            }
        }
    }

    /**
     * 获取元素上的标签属性,并且转换成数组返回
     * @param el    被获取属性的元素
     * @returns {*|Array.<T>}
     */
    static getDOMAttrs(el) {
        return Tool.toArray(el.attributes);
    }


    /**
     * 给元素追加class样式类
     * @param el            目标元素
     * @param classList     需要追加的类(String:"xxx"/"xxx yyy" | Array<String>)
     */
    static addClass(el, classList) {
        let classEs = el.classList;
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
    }

    /**
     * 给元素追加class样式类
     * @param el            目标元素
     * @param classList     需要删除的类(String:"xxx"/"xxx yyy" | Array<String>)
     */
    static removeClass(el, classList) {
        let classEs = el.classList;
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
    }

    /**
     * 给元素设置样式
     * @param el        目标元素
     * @param attr      样式名(String/Object)
     * @param value     样式值[,String]
     */
    static setStyle(el, attr, value) {
        let styleObj = {},
            styleArr = [];
        if (arguments.length === 2) {
            styleObj = attr;
        } else if (arguments.length === 3) {
            styleObj[attr] = value;
        }
        styleArr = Object.keys(styleObj).map(function (item) {
            return item + ":" + styleObj[item];
        });
        el.style.cssText += ";" + styleArr.join(";");
    }

    /**
     * 设置元素的标签属性
     * @param el        目标元素
     * @param attr      属性名(String/Object)
     * @param value     属性值([,String])
     */
    static setAttributes(el, attr, value) {
        let attrObj = {};
        if (arguments.length === 2) {
            attrObj = attr;
        } else if (arguments.length === 3) {
            attrObj[attr] = value;
        }
        Object.keys(attrObj).forEach(function (item) {
            if (el) {
                try {
                    el.setAttribute(item, attrObj[item]);
                    //  确保设置成功
                    if (el[item] !== attrObj[item]) {
                        el[item] = attrObj[item];
                    }
                } catch (ex) {
                    console.log(ex);
                    console.log(el);
                }
            }
        });
    }

    /**
     * 获取的标签属性
     * @param el        目标元素
     * @param attrs     属性名(String/Array<String>)
     * @returns {{}|Object}
     */
    static getAttributes(el, attrs) {
        let attrList = [],
            output = {}, tagName, val;
        if (!el) {
            return output;
        }
        tagName = el.tagName && el.tagName.toLowerCase();
        if (Tool.isType(attrs, "String")) {
            attrList = [attrs];
        } else if (Tool.isType(attrs, "Array")) {
            attrList = attrs;
        }
        attrList.forEach(function (item) {
            if (!Tool.isUndefined(tagName)) {
                val = el.getAttribute(item);
                if (val) {
                    output[item] = val;
                }
            }
        });
        return output;
    }


    /**
     * 判断元素是否隐藏
     * @param el    元素
     * @returns {boolean}
     */
    static isHide(el) {
        return el.style.display === "none";
    }

    /**
     * 判断一个元素是否存在
     * @param el    元素
     * @returns {boolean}
     */
    static isExist(el) {
        let rid;
        if (!el) {
            return false;
        }
        rid = this.getAttributes(el, ["rid"])["rid"];
        return this.getElementByRid(rid) !== null;
    }

    /**
     * 获取当前元素在其父元素中的位置
     * @param parent    父元素
     * @param child     子元素
     * @returns {number}
     */
    static getChildIndex(parent, child) {
        let childList = Tool.toArray(parent.children),
            res = -1;
        childList.forEach(function (el, index) {
            if (this.compareNodes(el, child)) {
                res = index;
            }
        }, this);
        return res;
    }

    /**
     * insertAfter方法
     * @param parent    父节点
     * @param el        要插入的子节点
     * @param index     插入的位置
     */
    static insertAfter(parent, el, index) {
        let childList = parent.children;
        if (index >= childList) {
            parent.appendChild(el);
        } else {
            parent.insertBefore(el, childList.item(index));
        }
    }

    /**
     * 判断是否是一个有效的DOM元素
     * @param el    被判断的元素
     * @returns {*|boolean}
     */
    static isAvailableDom(el) {
        return this.isHTMLNode(el) && !this.isHide(el) && !this.isExist(el);
    }


}

export default DOM;

