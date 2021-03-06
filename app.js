/*
  Base: 
  MongoDB+Express+AngularJS+Node.jsでシンプルなCRUDアプリ作成
  http://qiita.com/naga3/items/e63144e17cb1ab9e03e9
*/

var express = require('express');
var bodyParser = require('body-parser');  // for id
var mongodb = require('mongodb');

var app = express();
var BSON = mongodb.BSONPure;
var db, users, countries, contributors;

app.use(express.static('dist'));
app.use(express.static(__dirname + '/')); // for bower components
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());

mongodb.MongoClient.connect("mongodb://localhost:27017/washroom", function(err, database) {
  db = database;
  users = db.collection("users2");
  countries = db.collection("countries");
  contributors = db.collection("contributors");
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

// Get all countries
app.get("/api/countries", function(req, res) {
  countries.find().toArray(function(err, items) {
    res.send(items);
  });
});

// Get an country
app.get("/api/countries/:_id", function(req, res) {
  countries.findOne({_id: new BSON.ObjectID(req.params._id)}, function(err, item) {
    res.send(item);
  });
});

// Get all contributors
app.get("/api/contributors", function(req, res) {
  contributors.find().toArray(function(err, items) {
    res.send(items);
  });
});

// Get an contributor
app.get("/api/contributors/:_id", function(req, res) {
  contributors.findOne({_id: new BSON.ObjectID(req.params._id)}, function(err, item) {
    res.send(item);
  });
});