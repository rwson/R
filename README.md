### R

javaScript轻量级MVVM框架

---

#### Useage(Demo)

Demo是一个极简SPA应用

    git clone https://github.com/rwson/R
    
    cd R && npm install
    
    npm start
    
    //  访问 localhost:3000

#### API

声明Controller
    

    R.controller("indexCtrl", function(scope, pageParams) {
        
    });
    
通过R.controller(name, fn);声明一个Controller
        
在Controller中通过

    scope.set({
        "key1": "value1",
        "key2": []
    });
    
来设置绑定指令中所需的数据
        
通过
        
    scope.defineEvents({
        "event1": function() {
            //  ...
        },
        "event2": function() {
            //  ...
        }
    });
        
来设置绑定指令(事件类型所需要的处理函数)
        

---
    
自定义Provider


    R.provider("provider1", function() {
        //  ...
    });
    
或
    
    R.provider("provider2", {
        "key": "value",
        //  ...
    });

通过
        
    R.provider(name, anyType);
        
声明一个Provider

    

---

Controller添加依赖注入(添加provider)

    R.inject("indexCtrl", ["pageParams"]);

通过
        
            R.inject(controllerName, dependens);
            
将已经声明的Provider添加到对应的Controller中

其中dependens可以是字符串或者数组字符串类型

scope无需注入,并且始终作为controller回调的第一个参数
    


---

路由配置


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

- 提供R.directive方法,支持自定义指令
- 提供R.factory/R.service方法,使得Controller之间实现数据共享
- 提供更多指令
- 目前仅支持require形式的引入,提供支持CMD/script标签引入的方式
