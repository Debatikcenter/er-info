$(document).ready(function(){
  $("button[type='control']").click(function(){
    if( query == "" ){
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
            $('line[source="'+$(this).data('id')+'"]').css({ "opacity": "0", "transition": "opacity .5s ease" });
            $('line[target="'+$(this).data('id')+'"]').css({ "opacity": "0", "transition": "opacity .5s ease" });
          }
        });
      }
    } else {
      $(this).toggleClass("active");
      $("line").css({ "opacity": "0", "transition": "opacity .5s ease" });
      var activeNodes = [];
      $(".active[type='control']").each(function(){ activeNodes.push($(this).attr("name")); });
      if(activeNodes.length == 6 || activeNodes.length == 0 ) {
        $("button[type='control']").removeClass("active");
        $("circle").css({ "opacity": "1", "transition": "opacity .5s ease" });
        $("line").css({ "opacity": "1", "transition": "opacity .5s ease" });
      } else {
        $("circle:not([data-id='"+query+"'])").each(function(){
          var type = $(this).attr("type");
          if(activeNodes.indexOf(type) != -1){
            $(this).css({ "opacity": "1", "transition": "opacity .5s ease" });
            $('line[source="'+$(this).data('id')+'"]').css({ "opacity": "1", "transition": "opacity .5s ease" });
            $('line[target="'+$(this).data('id')+'"]').css({ "opacity": "1", "transition": "opacity .5s ease" });
          } else {
            $(this).css({ "opacity": "0", "transition": "opacity .5s ease" });
          }
        });
      }
    }
  });

  $(".slider input").change(function(){
    var val = $(this).val();
    $(".slider span").text(val);
    // links = $.grep( links, function(n, i){ return parseInt(n.grade) >= val; } );
    // simulation.restart();
    $("line").each(function(){
      if( parseInt( $(this).attr("grade") ) < val ){
        $(this).hide();
      } else {
        $(this).show();
      }
    })
  })
})
