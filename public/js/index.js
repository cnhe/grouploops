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
  $("#professorForm").append("<p>Your course id is " + courseId + ". Please save it and send the following link to your students.</p>");
  $("#professorForm").append("<a href='/student?courseId="+courseId+"'>"+document.location.origin+"/student?courseId="+courseId+"</a>");
  $("#professorForm").append("<br><p>To edit your course please visit: <a href='/editCourse?courseId='"+courseId+"></a></p>");
}
