var models = require('../models');
var mongoose = require('mongoose');
var Course = models.Course;
var ObjectId = mongoose.Types.ObjectId;

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
    var courseId = ObjectId(req.query.courseId);
    Course.findById(courseId, function(err, course) {
      if(err) console.log(err);
      if(!course)
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
  
  var newCourse = new Course({
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

exports.editCourse = function(req, res) {
  try {
    var courseId = ObjectId(req.query.courseId);
    
    Course.findById(courseId, function(err, course) {
      if(err) {
        console.log(err);
        res.send("invalid course id");
      }
      else {
        console.log("Editing course:" + course);
        res.render("editCourse", {course: course});
      }
    });
  } catch(e) {
    console.log(e);
    res.send("invalid course id");
    return;
  }
}

exports.deleteCourse = function(req, res) {
  var courseId = ObjectId(req.query.courseId);
  Course.findByIdAndRemove(courseId, function(err, course) {
    if(err) console.log(err);
    else {
      res.send(200);
    }
  });
}

exports.printCourses = function(req, res) {
  Course.find(function(err, courses) {
    console.log(courses);
  });
  res.send(200);
}
