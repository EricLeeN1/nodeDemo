var express = require('express');
var app = express();
//设置模板引擎
app.get('/:username/:id', function(req, res, next) {
    var username = req.params.username;
    //检索数据库，如果username不存在，那么next();

    if ('检索数据库') {
        console.log('1');
        res.send('用户信息:' + req.params.username);
        next();
    } else {
        next();
    }

});
app.get('/admin/login', function(req, res) {
    console.log('2');
    res.send('管理员登录');
});
app.get()
app.listen(3000);