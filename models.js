var mongoose = require('mongoose');

var CourseSchema = new mongoose.Schema({
  "name": String, 
  "professor": String,
  "num_students": Number,
  "group_size": Number
});

var CustomQuestionSchema = new mongoose.Schema({
  "course_id": mongoose.Schema.Types.ObjectId,
  "label": String,
  "type": String
});

var StudentSchema = new mongoose.Schema({
  // fields are defined here
  "name": String, 
  "student_id": String,
  "email": String,
  "phone_no": String
//  "course_id": mongoose.Schema.Types.ObjectId   // only if non distinct students
});

var GroupSchema = new mongoose.Schema({
  "name": String
});

// This is needed if we have "accounts" (i.e. logins)
//   If we have accounts, there will be unique students and they each 
//    have multiple courses
var StudentCourseSchema = new mongoose.Schema({
  "student_id": mongoose.Schema.Types.ObjectId, 
  "course_id": mongoose.Schema.Types.ObjectId
});

var StudentGroupsSchema = new mongoose.Schema({
  "student_id": mongoose.Schema.Types.ObjectId,
  "group_id": mongoose.Schema.Types.ObjectId 
});

exports.Course = mongoose.model('Course', CourseSchema);
var Student = mongoose.model('Student', StudentSchema);
var Group = mongoose.model('Group', GroupSchema);
var StudentCourse = mongoose.model('StudentCourse', StudentCourseSchema);
var StudentGroups = mongoose.model('StudentGroups', StudentGroupsSchema);
var CustomQuestion = mongoose.model('CustomQuestion', CustomQuestionSchema);
