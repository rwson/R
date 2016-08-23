/**
 * Url处理器
 */

"use strict";


class Url {

    constructor() {
    }

    /**
     * 处理state或者hash值
     * @param needState 是否支持
     * @param path      目标路由
     */
    static pushStateOrHash(needState, path) {
        if (!path) {
            return;
        }
        if (needState) {
            history.pushState("", "", path);
        } else {
            location.hash = path;
        }
    }

    /**
     * 获取页面的hash和state值
     * @param   rootPath    首页路径
     * @returns {{
     *      hash: "", path: ""
     * }}
     */
    static getHashOrState(rootPath) {
        let path = decodeURIComponent(location.pathname + this.getSearch()),
            hash = location.href.match(/#(.*)$/),
            output = {};
        rootPath = rootPath || "/";
        hash = hash ? hash[1] : rootPath;
        if (!path.indexOf(rootPath)) {
            path = "/" + path.slice(rootPath.length);
        }
        output.hash = hash;
        output.path = path;
        return output;
    }

    /**
     * 获取url中的?xxx=yyy
     * @returns {String || ""}
     * */
    static getSearch() {
        let match;
        match = location.href.replace(/#.*/, "").match(/\?.+/);
        return match ? match[0] : "";
    }

    /**
     * 获取url中的查询字符串,转成对象输出
     * @param url   被获取的字符串
     * @returns {{}||Object}
     */
    static getQueryString(url) {
        url = url || location.href;
        let arr = [], output = {}, _temp;
        if (url.indexOf("?") > -1) {
            arr = url.split("?")[1].split("&");
            arr.forEach((item) => {
                _temp = item.split("=");
                output[_temp[0]] = decodeURIComponent(_temp[1]);
            });
        }
        return output;
    }
}

export default Url;
