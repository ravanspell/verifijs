var MongoClient = require('mongodb').MongoClient;

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
})