/**
 * index.js
 * scope类,指定作用域
 */

"use strict";

import Tool from "../lib/Tool";
import Parser from "../Parser/index";
import Watcher from "../Watcher/index";

//  条件判断语句(&&/||/==/===/!=/!==/>/</>=/<=)
const conditionReg = /((\!)?\=+|>(\=)?|<(\=)?|\|\||\&\&)/g;

//  boolean值之间的计算(!xyz/!!xyz/!!!xyz/!...xyz)
const boolReg = /\!+/g;

//  基本数学计算表达式(+/-/*///%)
const calculateReg = /[\+|\-|\/*|\/|\%]/g;

//  三目运算符(a ? 'b' : c)
const trinocularExpReg = /[\w\W]+\?[\w\W]+\:[\w\W]+/;

//  括号,指定含有计算表达式中的计算优先级
const bracketsReg = /^\([\w\W]+\)$/g;

//  用于替换表达式中的开头和结尾括号
const bracketsReplace = /^\(|\)$/g;

class Scope {

    /**
     * Controller对应的scope对象
     * @param compiler   Compile类的实例
     * @constructor
     */
    constructor(compiler) {
        this.uId = Tool.randomStr(); //  单独的id
        this.compiler = compile; //  存储compile实例
        this.data = {}; //  数据对象
        this.events = {}; //  事件对象
    }


    /**
     * 设置/新增数据
     * @param obj   要设置的数据
     */
    set(obj) {
        //  转换成带getter/setter的对象,实现对数据的监听
        this.data = Tool.transfer(Tool.merge(this.data || {}, obj, true), {
            "context": this.compiler,
            "beforeUpdate": this.compiler.beforeUpdate,
            "update": this.compiler.update
        });

        //  给数据进行第一次赋值
        Object.keys(obj).forEach(function (key) {
            var val = obj[key];
            if (!("" + val).length && Tool.isType(val, "string")) {
                val = "";
            }
            this.data[key] = val;
        }, this);
    }

    /**
     * 获取this.data中key对应的数据值
     * @param key   属性名
     * @returns {*}
     */
    get(key) {
        var target = this.data[key];
        return Tool.isReferenceType(target) ? Tool.copy(target, true) : target;
    }

    /**
     * 更新数据
     * @param obj   要更新的数据
     */
    update(obj) {
        var watcherList = Watcher.get("watcherList"),
            uId = this.uId,
            updater;
        Object.keys(obj).forEach(function (key) {
            if (!Tool.isEqual(this.get(key), obj[key])) {
                this.data[key] = obj[key];
                if (watcherList.length > 1) {
                    watcherList.forEach(function (watcher) {
                        updater = {};
                        if (!Tool.isEqual(watcher.uId, uId) && Tool.isEqual(key, watcher.key)) {
                            updater[key] = obj[key];
                            watcher.scope.update(updater);
                        }
                    });
                }
            }
        }, this);
    }

    /**
     * 声明事件
     * @param obj   事件对象
     */
    defineEVENTs(obj) {
        this.events = Tool.copy(obj, true);
    }

    /**
     * 获取数据或者事件回调
     * @param exp   数据或者事件回调对应的key
     * @returns {*}
     */
    exec(exp) {
        return this.get(exp) || this.events[exp];
    }


    /**
     * 获取深层对象下的相关属性值(a["b"]["c"]["d"][,...])
     * @param expStr    指令表达式字符串
     * @param context   被获取属性的对象
     * @returns {{
         *      "executeStr": string,
         *      "result": *
         * }}
     * 代理执行Parser函数
     */
    execDeep(expStr, context) {
        return Parser.parse(expStr, context);
    }

    /**
     * 根据第一次编译拼接好的执行字符串,来获取数据,而不用重新编译
     * @param execStr   执行字符串
     * @param context   上下文作用域
     * @returns {*}
     */
    execByStr(execStr, context) {
        if (!execStr) {
            return;
        }
        return new Function("return " + execStr).call(context);
    }

    /**
     * link方法,做第一次数据绑定,代理执行Compile实例下的link,并且把Scope实例传入当scope
     */
    link() {
        this.compiler.link(this);
    }

}
