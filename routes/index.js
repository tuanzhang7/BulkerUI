var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var config = require('../config.js');
var host = config.mongodb.host;
var port = config.mongodb.port;
var db = config.mongodb.db;
var url = 'mongodb://' + host + ':' + port + '/' + db;
var coll=config.setting.collection;
/* GET home page. */
router.get('/:keyword?', function(req, res, next) {
    var keyword = req.params.keyword;

    MongoClient.connect(url, function (err, db) {
        var collection = db.collection(coll);
        var query = {};
        if (keyword) {
            var intKeyword=parseInt(keyword);
            query = {$or: [{"cm:name": keyword}, {id: intKeyword}]};
        }

        var projection = {_id: 0};
        var sort = {id: 1};
        collection.find(query, projection).sort(sort).limit(2).toArray(function (err, docs) {
            collection.find(query).count(function (err, count) {
                //console.log(docs);
                //var retulst = JSON.stringify(docs);
                db.close();
                res.render('index', {"title":"Bulker UI","docs":docs,"count":count});
            });
        });
    });
    // res.render('index', {});
});

module.exports = router;
