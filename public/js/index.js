var down = false,
    deselect = false;

$(".slot").mousedown(function() {
  down = true;
  deselect = $(this).hasClass("success");
  $(this).toggleClass("success");
});

$(".slot").mouseover(function() {
  if(down) $(this).addClass("success");
  if(deselect) $(this).removeClass("success");
});

$(".weekday").click(function() {
  var column = $(".weekday").index($(this));
  var somethingToSet = true;
  
});
