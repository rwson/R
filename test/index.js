/**
 * index.js
 * build by rwson @7/16/16
 * mail:rw_Song@sina.com
 */

"use strict";

//  无需编译的节点
var unCompileElems = ["html", "head", "meta", "link", "title", "object", "embed", "script"];

var directive = {
    "RBind": {
        "link": function (el, value) {
            el.innerHTML = value;
        }
    },
    "RClick": {
        "link": function (el, callback) {
            el.onclick = null;
            el.onclick = callback;
        }
    }
};

/**
 * 编译模块
 * @param el    根元素选择器
 * @constructor
 */
function Compile(el) {
    this.StoreEl = {};
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
        this.roomElement = document.querySelector(el) || document.body;
        this.data = {};
        this.eleMap = {};
        this.compile();
    },

    /**
     * 设置vm中的数据
     * @param data  数据
     */
    "set": function (data) {
        this.data = merge(this.data, data);

        var transferEd = transfer(this.data, {
            "beforeUpdate": this.beforeUpdate,
            "update": this.update
        });

        this.link();
    },

    "beforeUpdate": function () {
        console.log("我是更新之前的回调...");
    },

    "update": function (attr, value) {

        var keys = Object.keys(Compile.StoreEl);

        keys.forEach(function (key) {
            var el = Compile.StoreEl[key].el;
            var dires = Compile.StoreEl[key].directives;

            dires.forEach(function (dir) {
                if (dir.value === attr) {
                    var val = Compile.prototype.exec(attr);
                    var targetDirective = directive[dir.name].link(el, val);
                }
            }.bind(this));

        }.bind(this));
    },

    /**
     * 获取节点,过滤掉不编译的节点
     */
    "compile": function () {
        var eles = [].slice.call(this.roomElement.getElementsByTagName("*"));

        //  过滤掉不编译的子元素
        eles = eles.filter(function (el) {
            return !~(unCompileElems.indexOf(el.tagName.toLowerCase()))
        });

        //  便于过滤后的节点列表
        eles = eles.map(function (el) {
            var rid = randomStr();
            var attrRid = el.rid;
            var directives = this.getDirectives(el);
            if (!attrRid) {
                el.rid = rid;

                this.eleMap[rid] = {
                    "el": el,
                    "directives": directives
                };
            }
        }.bind(this));
        Compile.StoreEl = this.eleMap;
    },

    /**
     * 获取当前HTML节点上的指令
     * @param el    当前节点
     * @returns {Array.<T>}
     */
    "getDirectives": function (el) {

        var directiveKeys = Object.keys(directive);
        var attrs = [].slice.call(el.attributes);
        var res = [];

        //  将指令的r-xxx写法转换成rXxx写法,并且过滤掉未经过声明的指令
        attrs.forEach(function (attr, index) {
            var attrName = attr.name;
            var attrValue = attr.value;
            attrName = attrName.replace(/[^\b-]{1,90}/g, function (word) {
                return word.substring(0, 1).toUpperCase() + word.substring(1).replace("-", "");
            }).replace("-", "");
            if (!!(~directiveKeys.indexOf(attrName))) {
                res.push({
                    "name": attrName,
                    "value": attrValue
                });
            }
        });

        return res;
    },

    /**
     * 执行指令中的表达式
     * @param exp       表达式
     * @returns {*}
     */
    "exec": function (exp) {
        var value;
        var data = this.data;

        if (typeof exp === "function") {
            value = exp.call(this);
        } else if (typeof exp === "string") {
            try {
                value = new Function("return this.__" + exp + ";").call(this.data);
            } catch (ex) {
                console.log(ex);
                value = undefined;
            }
        }
        return value;
    },

    "link": function () {
        var keys = Object.keys(this.eleMap);

        keys.forEach(function (key) {
            var el = this.eleMap[key].el;
            var dires = this.eleMap[key].directives;
            dires.forEach(function (dir) {
                var value = this.exec(dir.value);
                var targetDirective = directive[dir.name].link(el, value);
            }.bind(this));

        }.bind(this));
    }

};

function transfer(target, opt) {
    for (var i in target) {
        var _key = "__" + i;
        if (!target[_key]) {
            target[_key] = target[i];
        }

        Object.defineProperty(target, i, {
            "get": function () {
                return target[i];
            },
            "set": function (val) {
                if (val !== target[_key]) {
                    opt.beforeUpdate(i, val);
                    target[_key] = val;
                    opt.update(i, val);
                }
            }
        });
    }
    return target;
}

function randomStr() {
    return ("" + Math.random()).toString(16).replace(".", "");
}

function merge(obj1, obj2, override) {
    for (var i in obj2) {
        if (i.match(/^__/) === null) {
            if (obj1[i] && override) {
                obj1[i] = obj2[i];
            } else {
                obj1[i] = obj2[i];
            }
        }
    }
    return obj1;
}

function copy(obj, deep) {
    //  typeof []/{} -> "object"
    if (!deep || obj == null || typeof obj !== "object") {
        return obj;
    }
    var copied;
    if (typeof obj === "object" && !Array.isArray(obj)) {
        copied = {};
    } else if (Array.isArray(obj)) {
        copied = [];
    }
    for (var i in obj) {
        if (obj.hasOwnProperty(i) || obj[i]) {
            copied[i] = obj[i];
        }
    }
    return copied;
}
