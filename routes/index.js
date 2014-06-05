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

exports.printStudents = function(req, res) {
  Student.find(function(err, stu) {
    console.log(stu);
    res.json(stu);
  });
};

exports.printCourses = function(req, res) {
  Course.find(function(err, courses) {
    console.log(courses);
    res.json(courses);
  });
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

exports.createNewStudent = function(req, res) {
  console.log("Creating new Student for course " + req.body.courseId);
  var courseId = ObjectId(req.body.courseId);
  // Do validation here

  Course.findById(courseId, 'num_students', function(err, course) {
    var maxStuCount = course.num_students;  
    Student.count(courseId, function(err, stuCount) {
      if(stuCount >= maxStuCount) {
        console.log("Reached max students");
        res.json({status: 0});
        return;
      } else {
        var availArr = !req.body.avail ? 
                          [] : 
                          req.body.avail.split(',').map(function(e) {return parseInt(e);})
        var studentObj = {
          name: req.body.name,
          student_id: req.body.studentId,
          email: req.body.emailAddr,
          phone: req.body.phone,
          course_id: ObjectId(req.body.courseId),
          leader_rating: parseInt(req.body.leaderRadios),
          work_pref: typeof(req.body.workPref) === 'string' ? req.body.workPref === 'off' ? 0 : 1 : 2,
          avail: availArr,
          avail_len: availArr.length
        };
        
        var newStudent = new Student(studentObj);

        newStudent.save(function(err, savedStudent) {
          if(err) console.log(err);
          else {
            res.json({status: 1});
            return;
          }
        });
      }
    });
  });
}

exports.waitingRoom = function(req, res) {
  res.render("waitingRoom", {courseId: req.query.courseId});
};

exports.newStud = function(req, res) {
  var courseId = ObjectId("5389ac78b15c2f820f978640");
  Student.remove({course_id: courseId}, function(err){});
  for(var i = 0; i < 122; ++i) {
    var randArr = [];
    for(var j = 0; j < Math.ceil(Math.random() * 21); ++j) {
      randArr.push( Math.floor(Math.random() * 21));
    }
    randArr = randArr.sort(function(a,b){return a-b;}).filter(function(e,i,self){return i==self.indexOf(e)});
    var sOb = {
          name: "Hi",
          student_id: "asdf123",
          course_id: courseId,
          leader_rating: Math.ceil(Math.random() * 5),
          work_pref: 3,
          avail: randArr,
          avail_len: randArr.length
    }
    var newStudent = new Student(sOb);
    newStudent.save(function(err, saved) {
      if(err) console.log(err);
      else {
        console.log(i);
      }});
  }
  res.json({});
};

exports.test = function(req, res) {
  var courseId = ObjectId(req.query.courseId);
  var k;

  // returns the number of matching times of availability from avail2 to avail1
  var countMatches = function(avail1, avail2) {
    var matches = 0;
    var ind = 0;
    for(var i = 0; i < avail2.length; ++i) {
      while(avail2[i] > avail1[ind])
        ++ind;
      if(avail2[i] == avail1[ind]) {
        ++matches;

      }
    }
    return matches;
  }

  Student.find({course_id: courseId}, null, {sort: {avail_len: -1, leader_rating: -1}}, function(err, students) {
    console.log(courseId);
    Course.findById(courseId, "num_students group_size", function(err, course) {
      k = Math.round(course.num_students / course.group_size);
      var leaders, members;
      for(var i = 0; i < k && i < students.length; ++i) {
        if(student[i].leader_rating > 3)
          leaders.push(student[i]);
        else
          members.push(student[i]);
      }
      var scores = [];

      for(var i = 0; i < members.length; ++i) {
        for(var j = 0; j < leaders.length; j++) {
          scores.push( {leader: j, member: i, score: countMatches(leaders[j].avail, members[i].avail)/leaders[j].avail_len});
          if(j == 24)
            console.log("member " + i + ": "+members[i].avail);
        }
      }
      scores.sort(function(a,b) {
        if(a.leader > b.leader) return 1;
        if(a.leader < b.leader) return -1;
        else {
          if(a.score > b.score) return -1;
          else return 1;
        }
      });
      console.log(scores);
      console.log(leaders[24]);
      res.json({});

    });
  });
}
