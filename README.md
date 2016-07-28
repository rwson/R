### R

javaScript轻量级MVVM框架

---

#### Useage(Demo)

Demo是一个极简SPA应用

    git clone https://github.com/rwson/R
    
    cd R && npm install
    
    npm start
    
    //  访问 localhost:3000

----

#### API

##### 声明Controller
    

    R.controller("indexCtrl", function(scope) {
        
        scope.set({
            "key": "value",
            //  ...
        });
        
        scope.defineEvents({
            "event1": function() {
                //  ...
            },
            "event2": function() {
                //  ...
            }
        });
        
    });
    
通过

    R.controller(name, fn);
    
声明一个Controller
        
在Controller中通过

    scope.set({
        "key1": "value1",
        "key2": []
    });
    
来设置绑定指令中所需的数据

通过

    scope.update({
        "key1": "value2"
    });
        
来修改相应数据
        
通过
        
    scope.defineEvents({
        "event1": function() {
            //  ...
        },
        "event2": function() {
            //  ...
        }
    });
        
来设置绑定指令(绑定事件指令所需要的处理函数)

---
    
##### 自定义Provider


    R.provider("provider1", function() {
        return {
            "key": "value",
            //  ...
        };
    });
    
或
    
    R.provider("provider2", {
        "key": "value",
        //  ...
    });

通过
        
    R.provider(name, any valid types);
        
声明一个Provider,需要注意的是,当函数第二个参数为function的时候,必须存在一个返回值,否则将是一个无效Provider

---

##### 自定义Service

    R.service("shareData", function() {
        return {
            "key": "value",
            //  ...
        };
    });
    
或

    R.service("shareData", {
        "key": "value",
        //  ...
    });

通过
    
    R.service(name, any valid types);

声明一个Service,需要注意的是,当函数第二个参数为function的时候,必须存在一个返回值,否则将是一个无效Service,通过数据共享可以实现相同数据在不同Controller种双向绑定的目的

---

##### Controller添加依赖注入(添加provider(相关[自定义]功能模块)/service(Controller数据共享))

    R.conntroller("appCtrl", function(scope, pageParams, shareData, customProvider){
        
        //  ...
        
    });

    R.inject("appCtrl", ["pageParams", "shareData", "customProvider"]);

通过
        
    R.inject(controllerName, dependens);
            
将已经声明的Provider/Service添加到对应的Controller中

其中dependens可以是字符串或者数组字符串类型

scope无需注入,并且始终作为controller回调的第一个参数

---

##### 路由配置


    R.config({
        "path": {
            "/": {
                "tplPath": "tpl/index.html",
                "controller": "indexCtrl"
            },
            "/list/:id": {
                "tplPath": "tpl/list.html",
                "controller": "listCtrl"
            }
        },
        "pushState": true / false
    });


通过
    
    R.config({
        "path": {
            
        },
        "pushState": true
    });

指定当前应用的路由

在path中,key可以是字符串或者REST风格(/list/:id)的路由配置

value对应一个Object,有tplPath和controller,且都为字符串类型

tplPath指定当前path对应的模板路径,当前检测到匹配当前路径后,会通过ajax的方式去请求该模板文件,并且放到DOM中,进行编译

controller声明的controller的名字,当模板文件被请求成功并且放到DOM中后会执行对应的controller的回调

---

##### 自定义指令

    R.directive("RCustom" ,{
        "extend": true,
        "type": "dom",
        "constructor": function(dirCfg) {
            //  ...
        },
        "link": function(el, exp, scope) {
            //  ...
        },
        "update": function(exp) {
            //  ...
        }
    });


通过
    
    R.config(name, opt);

可以实现自定义指令

1.name:作为该指令出现的名称,驼峰命名法,最后绑定到HTML标签上的时候用"-"分割,并且全小写

2.opt参数说明:


name | 意义 | 类型 | 是否可选
---|---|---|---
extend | 是否继承父类,默认继承,继承父类可以调用父类的构造器,重写父类相关成员属性 | boolean | 是
type | 指令类型,现阶段没有意义 | string | 是
priority | 指令优先级,知道指令执行顺序,现阶段没有意义 | number | 是
link | link方法,做第一次编译时被调用 | function | 必传
update | update方法,做相关数据更新时被调用 | function | 必传


---

#### 支持的指令(directive)

directive | 使用方式 | 描述
---|---|---
r-bind | r-bind="data" | 绑定数据的data属性,并且在有数据的时候会做为当前标签的textContent显示
r-model | r-model="name" | 绑定数据中的name属性,在键盘输入的时候修改对应数据中的值,常用于表单元素
r-href | r-href="link" | 绑定数据中的link属性,常搭配a标签使用,指定a标签的href属性
r-if | r-if="condition" | 只有在condition为true的时候,输出当前元素及其子元素
r-else | r-else="condition" | 和r-if相反
r-show | r-show="condition" | 只有在condition为true的时候,显示当前元素
r-hide | r-hide="condition" | 和r-show相反
r-for | r-else="item in list" | 循环一个list(Array),渲染页面
r-keydown | r-keydown="keyDownFn" | 在当前元素触发keydown事件的时候,运行keyDownFn
r-key-down | r-key-down="keyDownFn" | 在当前元素触发keydown事件的时候,执行相关函数,常用于表单元素
r-key-up | r-key-up="keyDownFn" | 和r-key-down类型,事件类型变成keyup,常用于表单元素

----

#### TODO

- ~~提供R.factory/R.service方法,使得Controller之间实现数据共享([AngularJs](https://angular.io/)中的service和factory有返回值类型区别,R中没有给返回值做类型限制,所以实现一个service,达到数据共享的目的)~~
- ~~目前路由配置中pushState对应的值为false的时候还是采用HTML5的处理方式,此处需要改成hash的处理方式~~
- ~~提供R.directive方法,支持自定义指令~~
- 提供更多内置指令以及指令优先级(约定执行顺序)
- 目前仅支持require形式的引入,提供支持CMD/script标签引入的方式
- 优化在通过Service方式共享数据时更新过慢的问题

----
