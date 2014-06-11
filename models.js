var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId;
    

var CourseSchema = new mongoose.Schema({
  "name": String, 
  "professor": String,
  "num_students": Number,
  "group_size": Number
});

var CustomQuestionSchema = new mongoose.Schema({
  "course_id": ObjectId,
  "label": String,
  "type": String
});

var StudentSchema = new mongoose.Schema({
  // fields are defined here
  "name": String, 
  "student_id": String,
  "email": String,
  "phone": String,
  "course_id": ObjectId,   // only if non distinct students
  "leader_rating": Number,
  "work_pref": Number, // 0 = off campus, 1 = on, 2 = either
  "avail": Array,
  "avail_len": Number,
  "group_id": ObjectId
});

var GroupSchema = new mongoose.Schema({
  "name": String
});


exports.Course = mongoose.model('Course', CourseSchema);
exports.Student = mongoose.model('Student', StudentSchema);
exports.Group = mongoose.model('Group', GroupSchema);
exports.CustomQuestion = mongoose.model('CustomQuestion', CustomQuestionSchema);
