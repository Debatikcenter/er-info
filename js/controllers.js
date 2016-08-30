var selectedNodes = [];
var deselectedNodes = [];
$(document).ready(function(){
  $("button[type='control']").click(function(){
    if( query == "" ){
      $(this).toggleClass("active");
      $("line").css({ "opacity": "1", "transition": "opacity .5s ease" });
      var activeNodes = [];
      $(".active[type='control']").each(function(){ activeNodes.push($(this).attr("name")); });
      if(activeNodes.length == 7 || activeNodes.length == 0 ) {
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
      if(activeNodes.length == 7 || activeNodes.length == 0 ) {
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


//   $(".multiselector span").on("click", function(){
//     var id = $(this).attr("id");
//     $(this).toggleClass("active");
//     $(".multiselector span:not(#"+id+")").removeClass("active");
//     if($(this).hasClass("active")) {
//       $('a').on('click.myDisable', function(e) { e.preventDefault(); });
//       if( $(this).attr("id") == "plus" ){
//         if( selectedNodes.length == 0 )
//           // $("#svg .person-node").css({"opacity": "0.3"})
//           $("#svg .person-node").removeClass("selected-node").addClass( "deselected-node" );
//       }
//       if( $(this).attr("id") == "minus"  ) {
//         if( selectedNodes.length == 0 )
//           // $("#svg .person-node").css({"opacity": "1"})
//           $("#svg .person-node").removeClass("deselected-node").addClass( "selected-node" );
//       }
//     }
//     else {
//       $('a').off('click.myDisable');
//       // $("#svg .person-node").css({"opacity": "1"})
//       $("#svg .person-node").removeClass("deselected-node").removeClass( "selected-node" );
//     }
//
//
//
//   })
//
//   $("#svg").on("click", ".person-node", function(){
//     if( $(".multiselector span.active").length > 0 ){
//       if( $(".multiselector span.active").attr("id") == "plus" ){
//         var personName = $(this).find("title").text();
//         if( selectedNodes.indexOf( personName ) == -1 )
//           selectedNodes.push( personName );
//         // $(this).css({"opacity": "1"});
//         $(this).removeClass( "deselected-node" ).addClass( "selected-node" );
//       } else if( $(".multiselector span.active").attr("id") == "minus" ){
//         var personName = $(this).find("title").text();
//         var index = selectedNodes.indexOf( personName );
//         if( index != -1 )
//           selectedNodes.splice( index, 1 );
//         // $(this).css({"opacity": "0.3"});
//         $(this).removeClass( "selected-node" ).addClass( "deselected-node" );
//       }
//       updateList();
//     }
//   })

})
