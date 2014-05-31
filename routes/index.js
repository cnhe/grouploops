var models = require('../models');

exports.professorView = function(req, res) {
  res.render('survey', {professor: 1});
};

exports.studentView = function(req, res) {
  res.render('survey', {student: 1});
};

exports.welcome = function(req, res) {
  res.render('welcome');
};

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
