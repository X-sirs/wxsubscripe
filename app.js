let express = require('express');
let app = express();
let path = require('path');
const jsonfile = require('jsonfile');
let apiconfig = require('./apiconfig.js');
let config = require('./config.js');
let url = require("url");
let wxcofig = null;
function tpl(timestamp,nonceStr,signature,jsApiList){
    return JSON.stringify({
                beta: true,
                debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: 'wwc51b851707d268bd', // 必填，公众号的唯一标识
                timestamp:timestamp , // 必填，生成签名的时间戳
                nonceStr:nonceStr, // 必填，生成签名的随机串
                signature:signature ,// 必填，签名，见附录1
                jsApiList:jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
}
app.use(require('express-xml-bodyparser')());
//app.use(require('./auth.js'));
app.use(require('./token.js'));
app.use(require('./jsticket.js'));
app.use(express.static("view"));
app.get('/', function (req, res, next) {
    res.send(`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>微信认证</title>
        </head>
        <body>
            <h1>腾讯地图测试</h1>
        </body>
        <script src="http://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script> 
        <script>
            wx.config(${tpl(res.locals.timestamp,res.locals.noncestr,res.locals.signature,apiconfig.jsapilist)});
            wx.ready(function () {
                wx.getLocation({
                    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                    success: function (res) {
                        alert(JSON.stringify(res));
                        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                        var speed = res.speed; // 速度，以米/每秒计
                        var accuracy = res.accuracy; // 位置精度
                    },
                    error: function () {
                        alert("获取定位错误")
                    }
                });
            });
            wx.error(function (res) {
                alert("jsapi获取错误")
            }); 
        </script>
    </html>`)
});
app.get('/getJSApiList', function (req, res, next) {
    res.send(tpl(new Date().getTime(), Math.random().toString(36).substr(2), res.locals.signature, apiconfig.jsapilist));
});
app.listen(8080,()=>{
    console.log("listening port on 8080")
})
