const fs = require("fs");
const url = require('url');
const path = require('path');
const express = require('express')
const app = express()
const port = 8081
const router = require('./server/route');
const bodyParser = require('body-parser')
const session = require("express-session");

// app.all('*', function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*"); //必须是具体网址 不是 *
//     res.header('Access-Control-Allow-Credentials', "true"); 　　//是否支持cookie跨域
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//
//     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//
//     res.header("X-Powered-By",' 3.2.1')
//     next();
// })

router.bindRouters(app,express);

app.listen(port,(err) => {
    if (!err) {
        console.log('Create server on http://localhost:8081/');
    } else {
        console.log(err);
    }
});




