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

##### config参数说明

参数名称 | 意义 | 可选值
---|---|---
path | 路由匹配 | [{...}]或者{}
pushState | 是否开启pushState | true/false
index | 首页路由 | 之前path里面配置的路由

##### API


方法 | 参数 | 意义
---|---|---
RouteAble.config | {Object} | 配置路由选项,参数必须为Object类型
RouteAble.run | [, callback] | 启动路由监听,可选callback
RouteAble.setData | {Object}[, boolean] | 第一个参数必须为Object类型,第二个参数true,代表只覆盖相关属性值,否则直接复制
RouteAble.getData | - | 取得页面Model中对应的数据
RouteAble.navigate | String path[, callback] | 第一个参数必须为String类型,第二个参数可选,表示跳转后执行的回调
routable.assignEvents | Object | 给当前页面指定Model对应的事件

---

属性 | 意义
---|---
RouteAble.pageParams | 取得浏览器地址栏中的参数(包含path/queryString)

##### 模板引擎和数据双向绑定

##### ·模板引擎

在本路由系统中,模板引擎比较简易,当然,功能也比较简单,所有的表达式都是放在以"<-"开头和以"->"结尾的表达式中,比如我们有如下的一个模板和数据:

    //  模板
    <div class="list-container">
        第 <- current -> 页
        <ul class="list-item">
            <- for(var i = 0,len = data.length; i < len; i ++){ ->
            <li><a href="<- data[i].link ->"><- data[i].title -></a></li>
            <- } ->
        </ul>
    </div>
    
    //  数据
    var params = routable.pageParams;
        var list = [
            {
                "link": "/detail",
                "title": "详情页(不带参数)"
            },
            {
                "link": "/detail/123",
                "title": "详情页(带url参数)"
            },
            {
                "link": "/detail?page=1",
                "title": "详情页(带url查询字符串)"
            },
            {
                "link": "/detail/123?page=1&location=detail",
                "title": "详情页(带url查询字符串)"
            }
        ];

        routable.setData({
            "current": params.page || 1,
            "data": list
        });

最后,渲染出来的结果应该是下面的样子:


    <div class="list-container"> 第 1 页
        <ul class="list-item">
            <li><a href="/detail">详情页(不带参数)</a></li>
            <li><a href="/detail/123">详情页(带url参数)</a></li>
            <li><a href="/detail?page=1">详情页(带url查询字符串)</a></li>
            <li><a href="/detail/123?page=1&amp;location=detail">详情页(带url查询字符串)</a></li>
        </ul>
    </div>

---

##### ·数据双向绑定

在本路由系统中,数据双向绑定由指令来完成,指令又分成3种:
- event事件回调指令,通过event-eventName绑定一个Modal中存在的事件,比如绑定一个click事件就是(event-click="fnName")

- model-bind绑定该输入框对应Model中的属性值的指令,通过model-bind=attrName来绑定Model中的一个属性,比如有时候需要用到表单域,需要绑定Model中一个属性就是(model-bind="username")

- attr标签属性指令,通过attr-attrName={boolean ? 'true': 'false'}

##### DEMO

    git https://github.com/rwson/routeable
    
    cd routeable && npm install 

    ...
    
    npm start
    
访问[http://localhost:3000](http://localhost:3000)查看效果
