var models = require('../models');
var mongoose = require('mongoose');

exports.professorView = function(req, res) {
  res.render('survey', {professor: 1});
};

exports.studentView = function(req, res) {
  res.render('survey', {student: 1});
};

exports.welcome = function(req, res) {
  res.render('welcome');
};

exports.checkCourseId = function(req, res) {
  try {
    var courseId = mongoose.Types.ObjectId(req.query.courseId);
    models.Course.find({ _id: courseId }, function(err, course) {
      if(err) console.log(err);
      if(course.length == 0)
        res.json({err: "Course does not exist"});
    });
  } catch(e) {
    res.json({err: "Invalid id"});
    return;
  }
  res.json({found: 1});
}

exports.createCourse = function(req, res) {
  // Do validation here

  
  var newCourse = new models.Course({
    name: req.body.courseName,
    professor: req.body.profName,
    num_students: req.body.numStudents,
    group_size: req.body.groupSize
  });

  newCourse.save(function(err, savedCourse) {
    if(err) console.log(err);
    else {
      res.json({courseId: savedCourse._id});
    }
  });
};
