SimpleJekyllSearch({
  searchInput: document.getElementById('search-input'),
  resultsContainer: document.getElementById('results-container'),
  json: baseurl + '/search.json',
  searchResultTemplate: '<li><a href="{url}">{title}</a></li>',
  noResultsText: '<span>No results</span>',
  limit: 10,
  fuzzy: false,
});

$(document).on( "click", "#results-container li a", function(){
  query = $(this).attr("data-id");
  var name = $(this).text();
  var url = window.location.href;
  if( url.indexOf('#') != -1 ){
    var base = url.substring(0, url.indexOf('#'));
    window.location.href = base + "#" + query;
  } else {
    window.location.href = url + "#" + query;
  }
  console.log( query );
  location.reload();

  // $("circle[data-id='"+id+"']").click();
  // $("svg").css({"margin-left": "-30%"})
  // $("svg>g").remove();
  // createGraph( query );

  // $("circle[data-id='"+query+"']").click();
  console.log("Graph created");
});

var focus = -1;

$(document).keydown(function(e){
  if( e.which === 40 ) {
    e.preventDefault();
    focus = (focus+1)%($("#results-container li").length);
    $("#results-container li:eq("+ (focus) +") a").focus();
    console.log(focus);
  } else if( e.which == 38 ){
    e.preventDefault();
    focus = (focus-1)%($("#results-container li").length);
    $("#results-container li:eq("+ (focus) +") a").focus();
    console.log(focus);
  }

});

$(document).keyup(function(e){
  if( $("#search-input").val().length == 0 ){
    $("#results-container li").remove();
    $("#results-container").hide();
  } else {
    $("#results-container").show();
  }
});
