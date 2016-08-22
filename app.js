var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('port', 3000);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//  渲染index2.ejs
app.get("/index2", function (req, res, next) {
    res.render("index2");
});

//  渲染index2.ejs
app.get("/test", function (req, res, next) {
    res.render("test");
});

//  各demo示例路由
app.get("/demo/*", function (req, res, next) {
    res.sendfile(path.resolve(path.join(__dirname, req.path + ".html")));
});

//  模拟文章列表请求
app.get("/list/articles", function (req, res, next) {
    res.json({
        "status": 1,
        "data": [
            {
                "title": "详情链接",
                "link": "/detail"
            },
            {
                "title": "详情链接带path参数",
                "link": "/detail/12345"
            },
            {
                "title": "详情链接带urlQueryString",
                "link": "/detail?id=12345"
            },
            {
                "title": "详情链接带path参数和urlQueryString",
                "link": "/detail/abcdefg?id=12345"
            }
        ]
    });
});

//  模拟文章详情请求
app.get("/detail/content", function (req, res, next) {
    res.json({
        "status": 1,
        "data": {
            "title": "我是详情标题",
            "content": "我是详情内容!"
        }
    });
});

//  测试ajax
app.get("/test/ajax/provider", function (req, res, next) {
    res.send(200, {
        "submit": req.query
    });
});

//  404
app.use("/", function (req, res, next) {
    res.render("index");
});

console.log("app start at port:" + app.get("port"));

module.exports = app;
