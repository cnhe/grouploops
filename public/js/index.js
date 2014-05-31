var down = false,
    deselect = false;

$(document).ready(function() {
	initializePage();
});

function initializePage() {

  initFreeTimeSelector();

  $("#professorForm").ajaxForm({
    dataType: "json",
		semantic: true,
		beforeSubmit: checkProfSurvey, 
		success: showCourseUrl
  });

}

function initFreeTimeSelector() {
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

function checkProfSurvey(formData, jqForm, options) {
  var form = jqForm[0];

  // Do not submit form if the groupsize is larger than the number of students in the class
  if(parseInt(form.groupSize.value) > parseInt(form.numStudents.value)) {
    // Should do something to notify user here
    return false;
  }
}

function showCourseUrl(rspTxt) {

}
