/**
 * Cookie模块
 */

"use strict";

class Cookie {

    costructor() {

    }

    /**
     * 设置cookie
     * @param key       cookie名
     * @param val       cookie值
     * @param expTime   过期时间
     */
    static setCookie(key, val, expTime) {
        expTime = expTime || 30;
        let exp = new Date();
        exp.setTime(exp.getTime() + expTime * 24 * 60 * 60 * 1000);
        document.cookie = key + "=" + escape(value) + ";expires=" + exp.toGMTString();
    }


    /**
     * 获取cookie
     * @param key   cookie名
     * @returns {null|string}
     */
    static getCookie(key) {
        if (!key) {
            return null;
        }
        let reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)"),
            arr = document.cookie.match(reg);
        return arr === null ? null : unescape(arr[2]);
    }

    /**
     * 删除cookie
     * @param key   cookie名
     */
    static deleteCookie(key) {
        if (!key) {
            return;
        }
        let exp = new Date(),
            cval = this.getCookie(key);
        exp.setTime(exp.getTime() - 1);
        if (cval !== null) {
            document.cookie = key + "=" + cval + ";expires=" + exp.toGMTString();
        }
    }

}

export default Cookie;
