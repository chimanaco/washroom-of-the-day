/*
  Base: 
  MongoDB+Express+AngularJS+Node.jsでシンプルなCRUDアプリ作成
  http://qiita.com/naga3/items/e63144e17cb1ab9e03e9

*/

var express = require('express');
// var bodyParser = require('body-parser');
var mongodb = require('mongodb');

var app = express();
var BSON = mongodb.BSONPure;
var db, users;

app.use(express.static('dist'));
app.use(express.static(__dirname + '/')); // for bower components
app.use(express.static(__dirname + '/public'));

// app.use(bodyParser.json());

mongodb.MongoClient.connect("mongodb://localhost:27017/washroom", function(err, database) {
  db = database;
  users = db.collection("users");
  app.listen(3000);
});

// Get all items
app.get("/api/users", function(req, res) {
  users.find().toArray(function(err, items) {
    res.send(items);
  });
});

// Get an item
app.get("/api/users/:_id", function(req, res) {
  users.findOne({_id: new BSON.ObjectID(req.params._id)}, function(err, item) {
    res.send(item);
  });
});

// Add an item
app.post("/api/users", function(req, res) {
  var user = req.body;
  users.insert(user, function() {
    res.send("insert");
  });
});

// Update an item
app.post("/api/users/:_id", function(req, res) {
  var user = req.body;
  delete user._id;
  users.update({_id: new BSON.ObjectID(req.params._id)}, user, function() {
    res.send("update");
  });
});

// Delete an item
app.delete("/api/users/:_id", function(req, res) {
  users.remove({_id: new BSON.ObjectID(req.params._id)}, function() {
    res.send("delete");
  });
});