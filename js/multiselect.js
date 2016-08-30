var selectedNodes = [  ];

$('#switch1').attr('checked', false);
//
// $(".multiselector #ms").click(function(){
//   if( $(this).find("span").text() == "off" ){
//      $(this).find("span").text("on");
//      $('a').on('click.myDisable', function(e) { e.preventDefault(); });
//      $("#svg .person-node").not("[root='true']").removeClass("selected-node").addClass( "deselected-node" );
//      selectedNodes.push( $("[root='true']").find("title").text() );
//   } else if( $(this).find("span").text() == "on" ){
//     $(this).find("span").text("off");
//     $('a').off('click.myDisable');
//     $("#svg .person-node").removeClass( "deselected-node" );
//     selectedNodes = [];
//   }
// });

$(".switch-container label").click(function(){

  // console.log($(this).siblings("input:checked").length);

  if( $(this).siblings("input:checked").length == 0 ){
     $('a.person-node').on('click.myDisable', function(e) { e.preventDefault(); });
     $("#svg .person-node").not("[root='true']").removeClass("selected-node").addClass( "deselected-node" );
     selectedNodes.push( $("[root='true']").find("title").text() );
  } else if( $(this).siblings("input:checked").length == 1 ){
    $('a').off('click.myDisable');
    $("#svg .person-node").removeClass( "deselected-node" );
    selectedNodes = [];
    $(".list-of-projects li").show();
  }
});



$("#svg").on("click", ".person-node", function(e){
  // console.log( $(".switch-container input:checked").length );

  if( $(".switch-container input:checked").length == 1 ){
    $(this).removeClass( "deselected-node" );
    var personName = $(this).find("title").text();
    if( selectedNodes.indexOf( personName ) == -1 )
      selectedNodes.push( personName );
    updateList();
  }

});

$("#svg").on("contextmenu", ".person-node", function(e){
  // console.log( $(".switch-container input:checked").length );

  if( $(".switch-container input:checked").length == 1 ){
    $(this).addClass( "deselected-node" );
    var personName = $(this).find("title").text();
    var index = selectedNodes.indexOf( personName );
    if( index != -1 )
      selectedNodes.splice( index, 1 );
    updateList();
    return false;
  }

});

$("#svg").on("dblclick", ".person-node", function(e){
  // console.log( $(".switch-container input:checked").length );

  if( $(".switch-container input:checked").length == 1 ){
    // $(this).addClass( "deselected-node" );
    // var personName = $(this).find("title").text();
    // var index = selectedNodes.indexOf( personName );
    // if( index != -1 )
    //   selectedNodes.splice( index, 1 );
    // updateList();
    // return false;
    window.location.href = $(this).attr("href");
  }

});


function updateList(){
  $(".list-of-projects li").each( function(){
    var found = false;
    for( var i=0; i<selectedNodes.length; i++ ){
      var selectedNode = selectedNodes[i];
      if( $(this).data("related-persons").indexOf(selectedNode) != -1 ){
        found = true;
      } else {
        found = false;
        break;
      }
    }
    if( found ){
      $(this).show();
    } else {
      $(this).hide();
    }
  } );
  if( selectedNodes.length > 0 ){
    $("#selected-persons").html("Projects shared between: <br/>")
    for( var i=0; i<selectedNodes.length; i++ ){
      $("#selected-persons").append( selectedNodes[i] )
      if( (i+1) != (selectedNodes.length) )
        $("#selected-persons").append( ", " )
    }
  } else {
    $("#selected-persons").text("");
  }
}
