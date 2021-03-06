/**
 * Created by Administrator on 2017/7/26.
 */
var express = require('express');
var app = express();
var db = require('./model/db.js');
var formidable = require('formidable');
var sd = require('silly-datetime');
var ObjectId = require('mongodb').ObjectID;

//设置模板引擎
app.set('view engine', 'ejs');

//静态服务
app.use(express.static('./public'));
//显示留言列表
app.get('/', function (req, res, next) {
    db.count('messages', function (err, count) {
        if (err) {
            console.log(err);
        }
        res.render('index', {
            count: Math.ceil(count / 2)
        });
    })

});
//显示留言列表,这个页面是供ajax使用的
app.get('/du', function (req, res, next) {

    // 可以接收一个参数
    var page = parseInt(req.query.page);
    var pagesize = 2;

    db.find('messages', {}, {"pageamount": pagesize, "page": page, "sort": {"timeStamp": -1}}, function (err, result) {
        res.json({"result": result});
    });
});
//处理留言
app.post('/submit', function (req, res, next) {
    var form = new formidable.IncomingForm(), ttt = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
    form.parse(req, function (err, fields) {
        db.insertOne("messages", {
            "name": fields.name,
            "message": fields.message,
            "time": ttt,
            "timeStamp": Date.parse(new Date()) / 1000
        }, function (err, result) {
            if (err) {
                res.json({
                    "msgcode": 0,
                    "msg": "提交失败!"
                });//0是给Ajax看的
                return;
            }
            res.json({
                "msgcode": 1,
                "msg": "提交成功!"
            });
        });
    });
});
//得到总数
app.get('/a', function (req, res) {
    db.count('messages', function (err, count) {
        if (err) {
            console.log(err);
        }
        console.log(count);
        res.send(count.toString());
    })
})
//删除留言
app.get('/delete', function (req, res,next) {
    var id = req.query.id;
    // db.find('message',{"_id":Objectid(id)},function (err,result) {
    //     if (err) {
    //         res.send('这条数据不存在或已经删除');
    //         return;
    //     }else {
    //         db.delete('message',{"_id":Objectid(id)},function (err,result) {
    //             console.log(result);
    //             res.send('这条数据已经删除');
    //         })
    //     }
    // })
    db.delete("messages",{"_id":ObjectId(id)},function (err,result) {
        if (err) {
            console.log(err);
        }
        res.redirect('/');//返回首页
        // res.send('删除成功，两秒后自动返回首页');
    });
});
app.listen(3000);