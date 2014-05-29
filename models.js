var Mongoose = require('mongoose');

var CourseSchema = new Mongoose.Schema({
  "name": String, 
  "professor": String,
  "num_students": Number,

});

var StudentSchema = new Mongoose.Schema({
  // fields are defined here
  "name": String, 
  "student_id": String,
  "email": String,
  "phone_no": String,
  "group_id": Mongoose.Schema.Types.ObjectId
});

var GroupSchema = new Mongoose.Schema({
  "id": String,
  "name": String
});

var UserGroupsSchema = new Mongoose.Schema({
  "user_id": String,
  "group_id": String
});

