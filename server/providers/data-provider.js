var dbClient = require('mongodb').MongoClient,
    config = require('config');

var DataProvider = function () {

    var mongoUri = config.get('mongoUri');

    function get(selector, collectionName, callback) {
        try {
            dbClient.connect(mongoUri, function (err, db) {

                if (!db) {
                    console.log("Connection to " + mongoUri + "can't be established!");
                    callback(err, null);
                    return;
                }

                var collection = db.collection(collectionName);

                collection.find(selector).toArray(function (err, docs) {
                    callback(err, docs);
                    db.close();
                });
            });
        } catch (err) {
            callback(err, null);
        }
    }

    function insert(document, collectionName, callback) {
        try {
            dbClient.connect(mongoUri, function (err, db) {

                if (!db) {
                    console.log("Connection to " + mongoUri + "can't be established!");
                    callback(err, null);
                    return;
                }

                var collection = db.collection(collectionName);

                var array = document;
                if (document && Object.prototype.toString.call(document) !== '[object Array]') {
                    array = [document];
                }

                collection.insertMany(array, function (err, result) {
                    callback(err, result);
                    db.close();
                });
            });
        } catch (err) {
            callback(err, null);
        }
    }

    function remove(selector, collectionName, callback) {
        try {

            dbClient.connect(mongoUri, function (err, db) {

                if (!db) {
                    console.log("Connection to " + mongoUri + "can't be established!");
                    callback(err, null);
                    return;
                }

                var collection = db.collection(collectionName);

                collection.deleteOne(selector, function (err, result) {
                    callback(err, result);
                    db.close();
                });
            });
        } catch (err) {
            callback(err, null);
        }
    }

    function update(selector, document, collectionName, callback) {
        try {

            dbClient.connect(mongoUri, function (err, db) {

                if (!db) {
                    console.log("Connection to " + mongoUri + "can't be established!");
                    callback(err, null);
                    return;
                }

                var collection = db.collection(collectionName);

                collection.updateOne(selector, {
                    $set: document
                }, {
                    upsert: true
                }, function (err, result) {
                    callback(err, result);
                });
            });
        } catch (err) {
            callback(err, null);
        }
    }

    return {
        get: get,
        insert: insert,
        remove: remove,
        update: update
    };
}();

module.exports = DataProvider;