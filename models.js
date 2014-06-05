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

// This is needed if we have "accounts" (i.e. logins)
//   If we have accounts, there will be unique students and they each 
//    have multiple courses
var StudentCourseSchema = new mongoose.Schema({
  "student_id": ObjectId, 
  "course_id": ObjectId
});

// Same as above
var StudentGroupsSchema = new mongoose.Schema({
  "student_id": ObjectId,
  "group_id": ObjectId 
});

exports.Course = mongoose.model('Course', CourseSchema);
exports.Student = mongoose.model('Student', StudentSchema);
exports.Group = mongoose.model('Group', GroupSchema);
exports.StudentCourse = mongoose.model('StudentCourse', StudentCourseSchema);
exports.StudentGroups = mongoose.model('StudentGroups', StudentGroupsSchema);
exports.CustomQuestion = mongoose.model('CustomQuestion', CustomQuestionSchema);
