var models = require('../models'),
    mongoose = require('mongoose'),
    faker = require('../Faker'),
    Course = models.Course,
    Student = models.Student,
    Group = models.Group,
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

exports.groups = function(req, res) {
  //var courseId = ObjectId(req.query.courseId);
  var studentId = ObjectId(req.query.studentId);
  Student.findById(studentId, function(err, student) {
    if(err) console.log(err);

    var d = {};
    var groups = new Array();
    var grpId = student.group_id;
    Student.find({group_id: grpId}, function(err, students) {
      res.render('groups', {group : students});
    });  
  });
}

/* Checks if the queried course id is valid or not */
exports.checkCourseId = function(req, res) {
  try {
    var courseId = req.query.courseId;
    Course.findOne({course_id: courseId}, function(err, course) {
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

/* Creates the course and saves it to the database */
exports.createCourse = createCourse;

function createCourse(req, res) {
  // Do validation here
  var id = makeid();
  Course.findOne({course_id: id}, function(err, course) {
    if(err) console.log(err);
    if(!course) {
      var newCourse = new Course({
        name: req.body.courseName,
        course_id: id,
        professor: req.body.profName,
        num_students: req.body.numStudents,
        group_size: req.body.groupSize
      });

      newCourse.save(function(err, savedCourse) {
        if(err) console.log(err);
        else {
          res.json({courseId: savedCourse.course_id});
        }
      });
    } else {
      createCourse(req, res);
    }
  });
  
  };

/* Route for editCourse page */
exports.editCourse = function(req, res) {
  try {
    var courseId = req.query.courseId;
    
    Course.findOne({course_id: courseId}, function(err, course) {
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

/* Deletes a course from the db */
exports.deleteCourse = function(req, res) {
  try {
    var courseId = req.query.courseId;
    Course.findOneAndRemove({course_id: courseId}, function(err, course) {
      if(err) console.log(err);
      else {
        res.send(200);
      }
    });
  } catch(e) {
    console.log(e);
    res.send(400);
  }
};

/* Prints all the students in the console and returns to the client */
exports.printStudents = function(req, res) {
  Student.find(function(err, stu) {
    console.log(stu);
    res.json(stu);
  });
};

/* Prints all the courses in the console and returns to the client */
exports.printCourses = function(req, res) {
  Course.find(function(err, courses) {
    console.log(courses);
    res.json(courses);
  });
};

/* Sends back json on the progress of student surveys a certain course */
exports.getSurveyProgress = function(req, res) {
  var completed, total;
  var courseId = req.query.courseId;
  Student.count({course_id: courseId}, function(err, count) {
    if(err) console.log(err);
    else {
      completed = count;
      Course.findOne({course_id: courseId}, function(err, course) {
        if(err) console.log(err);
        else {
          total = course.num_students;
          console.log(count);
          console.log(total);
          res.json({progress: (completed/total).toFixed(2)});
        }
      });
    }
  });
};

/* Creates a new student and saves it to the db */
exports.createNewStudent = function(req, res) {
  console.log("Creating new Student for course " + req.body.courseId);
  var courseId = req.body.courseId;
  // Do validation here

  Course.findOne({course_id: courseId}, 'num_students', function(err, course) {
    var maxStuCount = course.num_students;  
    Student.count({course_id: courseId}, function(err, stuCount) {
      if(stuCount >= maxStuCount) {
        console.log("Reached max students:" + stuCount + "/" + maxStuCount);
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
          course_id: courseId,
          leader_rating: parseInt(req.body.leaderRadios),
          work_pref: typeof(req.body.workPref) === 'string' ? req.body.workPref === 'off' ? 0 : 1 : 2,
          avail: availArr,
          avail_len: availArr.length
        };
        
        var newStudent = new Student(studentObj);

        newStudent.save(function(err, savedStudent) {
          if(err) console.log(err);
          else {
            console.log(savedStudent);
            res.json({studentId: savedStudent._id});
            return;
          }
        });
      }
    });
  });
}

/* Route to render raiting room view */
exports.waitingRoom = function(req, res) {
  res.render("waitingRoom", {courseId: req.query.courseId, studentId: req.query.studentId});
};

// clears all students and makes new ones for specified courseId
exports.newStud = function(req, res) {
  var courseId = req.query.courseId;
  var num = req.query.num || 100;
  Student.remove({}, function(err){});
  for(var i = 0; i < num; ++i) {
    var randArr = [];
    for(var j = 0; j < Math.ceil(Math.random() * 21); ++j) {
      randArr.push( Math.floor(Math.random() * 21));
    }
    randArr = randArr.sort(function(a,b){return a-b;}).filter(function(e,i,self){return i==self.indexOf(e)});
    var sOb = {
          name: faker.Name.findName(),
          student_id: "asdf123",
          email: faker.Internet.email(),
          course_id: courseId,
          leader_rating: Math.floor(Math.random() * 6),
          work_pref: 3,
          avail: randArr,
          avail_len: randArr.length
    }
    var newStudent = new Student(sOb);
    newStudent.save(function(err, saved) {
      if(err) console.log(err);
      else {
      }});
  }
  res.json({done: 1});
};

exports.genGroups = function(req, res) {
  var courseId = req.query.courseId;

  Student.find({course_id: courseId}, null, {sort: {avail_len: -1, leader_rating: -1}}, function(err, students) {

    // students is sorted by most available then by leader rating
    Course.findOne({course_id: courseId}, "num_students group_size", function(err, course) {
      var k = Math.floor(course.num_students / course.group_size);
      var lm = getLeadersMembers(k, students);
      var leaders = lm.leaders, members = lm.members;
      var groups; 

      if(req.query.groupBy || req.query.groupBy == "leader,best match")
        groups = groupByLeaderBestMatch(k, leaders, members, course.group_size);
      else
        groups = groupByLeaderAvail(k, leaders, members, course.group_size);

      makeGroups(groups, res);
    });
  });
}

exports.printGroups = function(req, res) {
  Group.find(function(err, groups) {
    console.log(groups);
    res.json(groups);
  });
}

function makeGroups(groups, res) {
  Group.remove({}, function(err){console.log(err)})
  var keys = Object.keys(groups);
  var newGroups = new Array();
  for(var i = 0; i < keys.length; ++i) {
    newGroups.push(new Group({name: i}));
  }
  var total = newGroups.length;
  function saveAll() {
    var grp = newGroups.pop();
    grp.save(function(err, savedGroup) {
      var name = savedGroup.name;
      var stus = groups[name];
      var numStus = stus.length;

      function updateAll() {
        var stu = stus.pop();

        var stuId= stu._id;
        Student.findByIdAndUpdate(stuId, {group_id: savedGroup._id}, function(err) {
          if(err) console.log(err);
        });

        if(--numStus) updateAll();
      }
      updateAll();
    });
    if(--total) saveAll();
    else
      res.json({done:1});
  }
  saveAll();
}

function groupByLeaderMostAvail(k, leaders, members, groupSize) {
  var scores = getMemberToLeaderScores(members, leaders, 0);

  // for each member sort by best score first
  scores.forEach(function(e){
    e.sort(function(a,b) {
      return b.score - a.score;
    });
  });

  var groups = {};
  for(var i = 0; i < leaders.length; ++i)
    groups[i] = [leaders[i]];

  // groups by most available first
  mostAvailFirst(scores, groups, members, groupSize);

  return groups;
}

function groupByLeaderBestMatch(k, leaders, members, groupSize) {
  var scores = getMemberToLeaderScores(members, leaders, 1);

  var groups = {};
  for(var i = 0; i < leaders.length; ++i)
    groups[i] = [leaders[i]];

  // groups by most available first
  bestMatchFirst(scores, groups, members, groupSize);

  return groups;
}

function mostAvailFirst(scores, groups, members, groupSize) {
  for(var i = 0; i < scores.length; ++i) {
    // add member to the group that the leader is in if group isn't full 
    for(var j = 0; j < scores[i].length; ++j) {
      var leader = scores[i][j].leader;
      if(groups[leader].length < groupSize) {
        groups[leader].push(members[i]);
        break;
      }
    }
  }
}

function bestMatchFirst(scores, groups, members, groupSize) {
  var highScores = new Array();
  for(var i = 0; i < scores.length; ++i)
    highScores = highScores.concat(scores[i]);
  highScores.sort(function(a,b) {
    return b.score - a.score;  
  });

  var done = {};

  for(var i = 0; i < highScores.length; ++i) {
    if(!done[highScores[i].member]) {
      var leader = highScores[i].leader;
      var member = highScores[i].member;
      if(groups[leader].length < groupSize) {
        groups[leader].push(members[member]);
        done[member] = 1;
      }
    }
  }

  // second pass
  if((members.length + Object.keys(groups).length)  % groupSize > 0) {
    for(var i = 0; i < highScores.length; ++i) {
      if(!done[highScores[i].member]) {
        var leader = highScores[i].leader;
        var member = highScores[i].member;
        if(groups[leader].length <= groupSize) {
          groups[leader].push(members[member]);
          done[member] = 1;
        }
      }
    }
  }
}

/* Rank/scores the members by comparing their availability to group leaders
    orderBy -> 0 will order scores by members, otherwise leader*/
function getMemberToLeaderScores(members, leaders, orderBy) {
  var scores = new Array();

  if(!orderBy) {
    // give each member a score for each leader indicating how close their schedules match to the leader
    for(var i = 0; i < members.length; ++i) {
      scores[i] = new Array();
      for(var j = 0; j < leaders.length; j++) {
        var score = countMatches(leaders[j].avail, members[i].avail)/leaders[j].avail_len;
        scores[i].push( {leader: j, member: i, score: score});
      }
    }
  } else {
    for(var i = 0; i < leaders.length; ++i) {
      scores[i] = new Array();
      for(var j = 0; j < members.length; j++) {
        var score = countMatches(leaders[i].avail, members[j].avail)/leaders[i].avail_len;
        scores[i].push( {leader: i, member: j, score: score});
      }
    }
  }
  return scores;
}

/* Rank/scores member by comparing availablity to groups */
function getMemberToGroupScores() {

}

/* Gets k leaders and n-k members */
function getLeadersMembers(k, students) {
  if(k > students.length)
    return null;

  var leaders = new Array(),
      members = new Array();
  // leaders are the students with most availablity and leader rating >= 3
  for(var i = 0; i < students.length; ++i) {
    if(i < k && students[i].leader_rating >= 3)
      leaders.push(students[i]);
    else
      members.push(students[i]);
  }
  while(leaders.length < k) {
    leaders.push(members.shift());
  }
  // there should be k leaders now

  return {leaders: leaders, members: members};

}

/* returns the number of matching times of availability from avail2 to avail1 
    assumes avail1 and avail2 are sorted
*/
function countMatches(avail1, avail2) {
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

function shuffle(array) {
  var currentIndex = array.length
    , temporaryValue
    , randomIndex
    ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
