$("h1").css("color", "red");
$("h1").addClass("big-title");
// $("h1").removeClass("big-title");
$("h1").text("lezagow");
$("button").text("Don't click me");
$("button").html("<i>Click me</i>");

$("img").attr("src");//get
$("img").attr("src","https://picsum.photos/200");
$("h1").click(()=>{
    $("h1").css("color","blue");
});
$("button").click(()=>{
    $("h1").css("color","violet");
});
$(document).keypress(function(event){
    $("h1").text(event.key);
});
$("h1").on("mouseover", function(event){
    $("h1").text("Noicee").css("color", "black");
});
//append .prefend(inside the element)
//after before
//.remove
//TODO: animations
//.hide() .show() .toggle() 
//.fadeOut() .fadeIn() .fadeToggle()
//.slideUp() .sideDown() 
//.animate({opacity:0.5}) only with numeric value
//