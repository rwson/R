/**
 * Router
 * 路由模块
 */

"use strict";

import Tool from "../lib/Tool";
import DOM from "../lib/DOM";
import Url from "../lib/Url";
import EVENT from "../lib/EVENT";

const paramRoute = /(\/\:\w+)+/g;             //  带url参数REST风格的路由
const replaceParam = /(\/\:\w+)/g;            //  替换掉url中参数的表示
const urlQueryStr = /\?[\S=\S]+/g;            //  url中带有queryString

class Router {

    constructor() {
        this.cfg = {
            "path": {},         //  Object,由path("/","/list"...)做key,value对应一个Object,包含tplPath,controller两个属性
            "pushState": true,  //  是否支持HTML5的pushState,传入false,即采用hash解决方案
            "default": "/",     //  首页
            "root": null        //  根元素
        };
        this.finalCfg = {};
        this.pageParams = {};
    }

    /**
     * 配置
     * @param opt   配置
     */
    config(opt) {
        var finalCfg = Tool.merge(_route.cfg, opt, true),       //  合并传入的参数和原来的默认配置                                           //
            cfgObj = {},                                        //  用来缓存Object方式配置路由的数据
            toMerge = {},                                       //  原来的正则表达式对象和新的属性合并
            cPath,                                              //  Object方式配置路由,会遍历每一项,cPath表示当前一项
            res,                                                //  路由带参数时匹配结果
            regex;                                              //  正则表达式对象

        if (Tool.isType(finalCfg.path, "Object")) {
            Object.keys(finalCfg.path).forEach(function (item) {
                cPath = finalCfg.path[item];

                res = ("" + item).match(paramRoute);
                regex = new RegExp(("" + item).replace(replaceParam, "\\/\\w+"));
                toMerge = {
                    "path": item
                };

                //  url中带有"/:",将该配置项变成正则表达式,并且添加相关正则
                if (res) {
                    toMerge = {
                        "config": item,
                        "path": regex,
                        "regex": regex
                    };
                }

                //  合并默认参数和传入的参数
                cfgObj[item] = Tool.merge(cPath, toMerge, true);
            });
            finalCfg.path = cfgObj;
        }
        this.finalCfg = finalCfg;
    }

    /**
     * 获取当前path在配置中的相关参数
     * @param path  当前页面的path
     * @returns {*}
     */
    getCurrent(path) {
        var route = this.finalCfg.path,
            keys = Object.keys(route),
            fPath = path,
            loopI = 0,
            loopLen = keys.length,
            loopKey, cfgObj, output, urlSplits, cfgSplits;

        //  url中存在查询字符串,将url转换成"?"前面的内容,再进行比对
        if (fPath.match(urlQueryStr)) {
            this.pageParams.queryString = Url.getQueryString(fPath);
            fPath = fPath.split("?")[0];
        }

        for (; loopI < loopLen; loopI++) {
            loopKey = keys[loopI];
            cfgObj = route[loopKey];

            if (Tool.isType(cfgObj.path, "String") && Tool.isUndefined(cfgObj.regex) && Tool.isEqual(cfgObj.path, fPath)) {
                output = route[loopKey];
                loopI = 0;
                break;
            } else if (Tool.isType(cfgObj.path, "Regexp") && cfgObj.regex.test(fPath)) {
                output = route[loopKey];
                loopI = 0;
                break;
            }
        }

        //  url中带参数配置项
        if (output && output.regex) {
            urlSplits = fPath.split("/");
            cfgSplits = output.config.split("/");

            cfgSplits.forEach(function (item, index) {
                if (("" + item).indexOf(":") > -1) {
                    if (!this.pageParams.path) {
                        this.pageParams.path = {};
                    }
                    this.pageParams.path[item.replace(":", "")] = urlSplits[index];
                }
            }, this);
        }
        return output;
    }

    /**
     * 点击有效a标签或者pushState后的回调
     * @param callback  成功后的回调
     */
    navigate(callback) {
        var cfg = this.finalCfg,
            cPath = Url.getHashOrState(cfg.default),
            path = cfg.pushState ? cPath.path : cPath.hash,
            curCfgObj = this.getCurrent(path),
            framement, divNode;

        if (!curCfgObj) {
            return;
        }

        this.requestTemplate(curCfgObj.tplPath)
            .then((res)=> {
                cfg.root.innerHTML = "";

                //  创建fragement
                framement = DOM.createFragment();
                divNode = document.createElement("div");
                divNode.classList.add("ctrl-ele");

                divNode.innerHTML = Tool.trim(res.response);

                //  依次作为子节点添加
                framement.appendChild(divNode);
                cfg.root.appendChild(framement);

                callback(divNode, curCfgObj);
            }, (res) => {
                throw new Error(res);
            })
            .catch((ex) => {
                throw new Error(ex);
            });
    }

    /**
     * 请求HTML模板片段
     * @param url       模板路径
     */
    requestTemplate(url) {
        if (url) {
            let fetchPromise = new Promise((resolve, reject) => {
                fetch({
                    "url": url,
                    "method": "GET",
                    "withCredentials": true,
                    "headers": {
                        "Accept": "text/html"
                    }
                }).then((res) => {
                    if (res.status >= 200 && res.status) {
                        resolve(res);
                    } else {
                        reject(res);
                    }
                }).catch((ex) => reject);
            });
        } else {
            Tool.exception("the url path must be a valid string");
        }
    }

    /**
     * 初始化事件(有效a标签的click事件,浏览器的前进后退)
     */
    initEVENTs(callback) {
        var cfg = this.finalCfg,
            path, target, tagName, pathEs, loopI, loopLen, child;

        //  所有a标签的点击事件
        EVENT.delegatEVENT(document, ["click"], function (ev) {
            ev = ev || event;
            target = ev.target;

            pathEs = ev.path;

            loopI = 0;
            loopLen = pathEs.length;

            //  循环触发该事件的列表
            for (; loopI < loopLen; loopI++) {
                child = pathEs[loopI];
                if (DOM.isHTMLNode(child)) {
                    path = DOM.getAttributes(child, ["href"]).href;
                    tagName = child.tagName.toLowerCase();

                    if (tagName === "a" && path) {

                        //  HTML5中pushState不会触发popstate事件,手动调用navigate
                        if (cfg.pushState) {
                            history.pushState({}, "", path);
                            this.navigate(callback);
                        } else {
                            location.hash = path;
                        }
                        break;
                    }
                }
            }

            EVENT.prevDefault(ev);
        }.bind(this));

        //  浏览器前进后退
        EVENT.delegatEVENT(root, ["popstate"], true, function (ev) {
            this.navigate(callback);
            EVENT.prevDefault(ev);
        }.bind(this));
    }

}

export default Router;
