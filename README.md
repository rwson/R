### 前端路由组件

##### usage

    define(["path/to/src/index.js", "ctrl1", "ctrl2"], function(routable, ctrl1, ctrl2) {
    
        routable.config({
            "path": ...,
            "pushState": true,
            "default": "/"
        });
    
    });

path支持两种配置路由方式,Array和Object两种形式

Array:

    "path": [
        {
            "path": "/",
            "tplPath": "/tpl/index.html",
            "controller": indexCtrl
        },
        {
            "path": "/list",
            "tplPath": "/tpl/list.html",
            "controller": listCtrl
        },
        {
            "path": "/list/:page",
            "tplPath": "/tpl/list.html",
            "controller": listCtrl
        },
        {
            "path": "/detail",
            "tplPath": "/tpl/detail.html",
            "controller": detailCtrl
        },
        {
            "path": "/detail/:id",
            "tplPath": "/tpl/detail.html",
            "controller": detailCtrl
        }
    ],

Object:

    "path": {
        "/": {
            "tplPath": "/tpl/index.html",
            "controller": indexCtrl
        },
        "/list": {
            "tplPath": "/tpl/list.html",
            "controller": listCtrl
        },
        "/list/:page": {
            "tplPath": "/tpl/list.html",
            "controller": listCtrl
        },
        "/detail": {
            "tplPath": "/tpl/detail.html",
            "controller": detailCtrl
        },
        "/detail/:id": {
            "tplPath": "/tpl/detail.html",
            "controller": detailCtrl
        }
    }

里面每一项对应的controller必须是一个函数指针,指向一个已经声明的函数。

在url中含有参数或者查询字符串的情况下,可通过routable.pageParams来获取,routable.pageParams中含有两个属性queryString和path,比如(/list/2?page=2),配置的路由是("/list/:page"),这样一个url,routable.pageParams就是如下的结构:

    
    {
        "path": {
            "page": 2
        },
        "queryString": {
            "page": 2
        }
    }

##### 参数说明

参数名称 | 意义 | 可选值
---|---|---
path | 路由匹配 | [{...}]或者{}
pushState | 是否开启pushState | true/false
index | 首页路由 | 之前path里面配置的路由

##### API

- RouteAble.config();       配置路由选项
- RouteAble.setData();      设置页面渲染所需数据
- RouteAble.setData();      取得数据
- RouteAble.navigate();     跳转到指定的路由
- RouteAble.pageParams;     取得url中的参数(path/queryString)

##### DEMO

    git https://github.com/rwson/routeable
    
    cd routeable && npm install 

    ...
    
    npm start
    
访问[http://localhost:3000](http://localhost:3000)查看效果
