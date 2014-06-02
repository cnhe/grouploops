var models = require('../models'),
    mongoose = require('mongoose'),
    Course = models.Course,
    Student = models.Student,
    ObjectId = mongoose.Types.ObjectId;

exports.professorView = function(req, res) {
  res.render('survey', {professor: 1});
};

exports.studentView = function(req, res) {
  res.render('survey', {student: 1, courseId: req.query.courseId});
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
};

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
};

exports.deleteCourse = function(req, res) {
  var courseId = ObjectId(req.query.courseId);
  Course.findByIdAndRemove(courseId, function(err, course) {
    if(err) console.log(err);
    else {
      res.send(200);
    }
  });
};

exports.printCourses = function(req, res) {
  Course.find(function(err, courses) {
    console.log(courses);
  });
  res.send(200);
};

exports.getSurveyProgress = function(req, res) {
  var completed, total;
  var courseId = ObjectId(req.query.courseId);
  console.log(req.query);
  Student.count({course_id: courseId}, function(err, count) {
    if(err) console.log(err);
    else {
      completed = count;
      Course.findById(courseId, function(err, course) {
        if(err) console.log(err);
        else {
          total = course.num_students;
          console.log("progress: " + completed/total);
          res.json({progress: (completed/total).toFixed(2)});
        }
      });
    }
  });
};

exports.waitingRoom = function(req, res) {
  console.log(req.body);
  // Do validation here
  
  var newStudent = new Student({
    name: req.body.name,
    student_id: req.body.studentId,
    email: req.body.emailAddr,
    phone: req.body.phone,
    course_id: ObjectId(req.body.courseId),
    leader_rating: parseInt(req.body.leaderRadios),
    work_pref: typeof(req.body.workPref) === 'string' ? req.body.workPref === 'off' ? 0 : 1 : 2,
    avail: !req.body.avail ? [] : req.body.avail.split(',').map(function(e) {return parseInt(e);})
  });

  newStudent.save(function(err, savedStudent) {
    if(err) console.log(err);
    else {
      res.render("waitingRoom");
    }
  });

};
