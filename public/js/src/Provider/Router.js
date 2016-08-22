/**
 * Router
 * 路由模块
 */

"use strict";

let store = new WeakMap();


class Router {

    constructor() {
        this.cfg = {
            "path": {},         //  Object,由path("/","/list"...)做key,value对应一个Object,包含tplPath,controller两个属性
            "pushState": true,  //  是否支持HTML5的pushState,传入false,即采用hash解决方案
            "default": "/",     //  首页
            "root": null        //  根元素
        };

        this.finalCfg = {};
    }


}
