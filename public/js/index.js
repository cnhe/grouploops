var down = false,
    deselect = false;

$(document).ready(function() {
	initializePage();
});

function initializePage() {
  // Redirect to home when jumbotron is clicked.
  // should make navigation more intuitive..
  $("#jumbotron").click(function() {
    document.location = "/"; 
  });

  initStudentSurvey();

  initProfessorSurvey();

  initWaitingRoom();
}

function initStudentSurvey() {
  if(document.location.pathname !== "/student")
    return;

  $(".slot").mousedown(function() {
    down = true;
    deselect = $(this).hasClass("success");
    $(this).toggleClass("success");
  });

  $(".slot").mouseover(function() {
    if(down) $(this).addClass("success");
    if(deselect) $(this).removeClass("success");
  });

  // Unfinished
  // When clicking the weekday name, highlight or unhighlight cells
  $(".weekday").click(function() {
    var column = $(".weekday").index($(this));
    var somethingToSet = true;
  });

  $("#studentForm").ajaxForm({
    beforeSubmit: checkStudentSurvey,
    success: function(rspTxt, stat) {
      if(!rspTxt.status)
        $("#maxStudentErrMsg").show();
      else
        document.location = "/waitingRoom?courseId="+$("input[name=courseId]").val(); 
    }
  });

  $("#studentForm :submit").click(function(e) {
    $("input[name=avail]").remove();
    var availArray = [];
    $(".slot.success").each(function() {
      availArray.push(this.id);
    });
    
    $("#studentForm").append($("<input>").attr({type: "hidden", name: "avail", value: availArray.join(',')}));
  });
}

// Checks the form data and display error messages
function checkStudentSurvey() {
  if(document.location.pathname !== "/student")
    return;
  
  var err = 0;

  $(".errMsg").hide();

  if($(".slot.success").length == 0) {
    $("#missingAvail").show();
    ++err;
  }
    
  if($("input[name=workPref]").fieldValue().length == 0) {
    $("#missingWorkPref").show();
    ++err;
  }

  return !err;
}

function initProfessorSurvey() {
  if(document.location.pathname !== "/professor")
    return;

  $("#professorForm").ajaxForm({
    dataType: "json",
		semantic: true,
		beforeSubmit: checkProfSurvey, 
		success: showCourseUrl
  });

}

function checkProfSurvey(formData, jqForm, options) {
  var form = jqForm[0];

  // Do not submit form if the groupsize is larger than the number of students in the class
  if(parseInt(form.groupSize.value) > parseInt(form.numStudents.value)) {
    // Should do something to notify user here
    return false;
  }
}

function showCourseUrl(rspTxt) {
  var courseId = rspTxt.courseId;
  $("#profFormSubmit").remove();
  $("#professorForm").append("<h2 id='createdCourse'>Course ID: <span id='courseID'>" + courseId 
                           + "</span><br/> Student survey link: "
                           + "<a href='/student?courseId="+courseId+"'>"+document.location.origin+"/student?courseId="+courseId+"</a></h2>");
  $("#professorForm").append("<br><h3>Edit Course: <a href='/editCourse?courseId='"+courseId+">"+document.location.origin+"/editCourse?courseId="+courseId+"</a></h3>");
}

function initWaitingRoom() {
  if(document.location.pathname !== "/waitingRoom")
    return;

  function updateProgressBar(){
    var courseId = $("#courseId").val();
    $.get("/getSurveyProgress?courseId="+courseId, function(data){
      var progress = Math.round(100*data.progress);
       $("#classProgress").css('width',progress+'%');
       $("#classProgress").html(progress+'%');
       if(progress==100) {
         $("#finishedMessage").css('display', "block");
         window.clearInterval(intervalId);
         $.get("/genGroups?courseId="+courseId+"&groupBy=leader,best match", function(data) {
           document.location = "/groups?courseId="+courseId;
         });
       }
     });
  }
  updateProgressBar();
  var intervalId = window.setInterval(updateProgressBar, 10000); 

}
