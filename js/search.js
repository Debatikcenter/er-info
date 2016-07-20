SimpleJekyllSearch({
  searchInput: document.getElementById('search-input'),
  resultsContainer: document.getElementById('results-container'),
  json: baseurl + '/search.json',
  searchResultTemplate: '<li><a href="#" data-id={id} title="{desc}">{title}</a></li>',
  noResultsText: '<span>No results</span>',
  limit: 10,
  fuzzy: false,
});

$(document).on( "click", "#results-container li a", function(){
  var id = $(this).data("id");
  console.log(id);
  $("circle[data-id='"+id+"']").focus();
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
  }
});
