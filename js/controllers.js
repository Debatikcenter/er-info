$(document).ready(function(){
  $("button[type='control']").click(function(){
    $(this).toggleClass("active");
    $("line").css({ "opacity": "1", "transition": "opacity .5s ease" });
    var activeNodes = [];
    $(".active[type='control']").each(function(){ activeNodes.push($(this).attr("name")); });
    if(activeNodes.length == 6 || activeNodes.length == 0 ) {
      $("button[type='control']").removeClass("active");
      $("circle").css({ "opacity": "1", "transition": "opacity .5s ease" });
    } else {
      $("circle").each(function(){
        var type = $(this).attr("type");
        if(activeNodes.indexOf(type) != -1){
          $(this).css({ "opacity": "1", "transition": "opacity .5s ease" });
        } else {
          $(this).css({ "opacity": "0", "transition": "opacity .5s ease" });
          $("line[source='"+$(this).data('id')+"']").css({ "opacity": "0", "transition": "opacity .5s ease" });
          $("line[target='"+$(this).data('id')+"']").css({ "opacity": "0", "transition": "opacity .5s ease" });
        }
      });
    }
  });

  $(".slider input").change(function(){
    var val = $(this).val();
    $(".slider span").text(val);
    $("line").each(function(){
      if( $(this).attr("grade") < val ){
        $(this).hide();
      } else if( $(this).attr("grade") >= val ){
        $(this).show();
      }
    })
  })
})
