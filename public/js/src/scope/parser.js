/**
 * parser.js
 * scope类,指定作用域
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["tool"], function (Tool) {
            return factory(root, Tool);
        });
    }

}(window, function (root, Tool, undefined) {

    var conditionReg = /((\!)?\=+|>(\=)?|<(\=)?|\|\||\&\&)/;    //  条件判断
    var boolReg = /^\!+/;                                       //  转布尔操作
    var calculateReg = /[\+|\-|\/*|\/|\%]/;                     //  计算语句
    var trinocularExpReg = /[\w\W]+\?[\w\W]+\:[\w\W]+/;         //  三目运算
    var bracketsReg = /\([\w\W]+\)(\w\W)?/g;                    //  带括号表达式
    var bracketsReplace = /\(|\)/g;                             //  替换括号
    var attrReg = /(\w\W)+(\[(\w\W)+\])+/g;                     //  读取属性

    /**
     * 读取对象下的属性并获取计算操作符
     * @param str      执行字符串
     * @param context  上下文作用域
     */
    function Parser(str, context) {
        if (arguments.length < 2) {
            throw new Error("method Parser must pass in two arguments");
        }

        var isCondition = false,
            condition = null,
            isBoolean = false,
            isCalculate = false,
            isTrinocular = false,
            isAttr = false,
            strArr = [str],
            strExec = "";

        isCondition = conditionReg.test(str);
        isBoolean = boolReg.test(str);

        if (isCondition) {
            condition = str.match(conditionReg)[0];
            strArr = str.split(condition);
        }

        strArr = strArr.map(function(strIn) {
            var isConditionIn = false,
                conditionIn = "",
                isBooleanIn = false,
                booleanIn = "",
                isCalculateIn = false,
                calculateIn = "",
                isTrinocularIn = false,
                withBrackets = false,
                bracketsIn = "",
                bracketsInStr = "",
                isAttrIn = false,
                strArrIn = [strIn];

            strIn = Tool.trim(strIn);

            isConditionIn = conditionReg.test(strIn);
            isCalculateIn = calculateReg.test(strIn);
            isBooleanIn = boolReg.test(strIn);
            withBrackets = bracketsReg.test(strIn);

            if (isConditionIn) {
                conditionIn = strIn.match(conditionReg)[0];
                strArrIn = strIn.split(conditionIn);

                strIn = strArrIn.map(function(staI) {
                    staI = Tool.trim(staI);

                    try {
                        new Function("return this." + staI).call(context);
                        staI = "this." + staI;
                    } catch (ex) {
                        staI = staI;
                    }

                    return staI;
                }).join(conditionIn);
            } else if (isCalculateIn && !withBrackets) {
                calculateIn = strIn.match(calculateReg)[0];
                strArrIn = strIn.split(calculateIn);

                strIn = strArrIn.map(function(staI) {
                    staI = Tool.trim(staI);

                    try {
                        new Function("return this." + staI).call(context);
                        staI = "this." + staI;
                    } catch (ex) {
                        staI = staI;
                    }

                    return staI;
                }).join(calculateIn);

            } else if(withBrackets) {
                bracketsIn = strIn.match(bracketsReg)[0];

                bracketsInStr = buildFunctionStr(bracketsIn.replace(bracketsReplace, ""), context);
                strIn = buildFunctionStr(strIn.replace(bracketsIn, ""), context);

                strIn = "(" + bracketsInStr + ")" + strIn;

            } else if (isBooleanIn) {
                booleanIn = strIn.match(boolReg)[0];
                strIn = strIn.replace(booleanIn, "");

                try {
                    new Function("return this." + strIn).call(context);
                    strIn = "this." + strIn;
                } catch (ex) {
                    strIn = strIn;
                }

                strIn = booleanIn + "(" + strIn + ")";

            } else {
                try {
                    new Function("return this." + strIn).call(context);
                    strIn = "this." + strIn;
                } catch (ex) {
                    strIn = strIn;
                }
            }

            return strIn;

        });

        if (isCondition) {
            strExec = strArr.join(condition);
        } else {
            strExec = strArr.join("");
        }

        return {
            "executeStr": strExec,
            "result": new Function("return " + strExec + ";").call(context)
        };
    }

    return Parser;

}));
