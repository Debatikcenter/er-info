var baseurl = $("p#baseurl").text();

var svg = d3.select("#svg"),
    height = window.innerHeight - 65;
    svg.attr("width", "100%")
      .attr("height", height);

var width = parseInt( $("#svg").css("width"), 10 );
console.log(width);

var container;
var data = baseurl+"/persons.json";

var links, persons;

var json;

var query = $("#query").text();
var url = window.location.href;

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody().strength(function(){ if(query!="") return -300; else return -150; }))
    .force("center", d3.forceCenter(width / 2, height / 2));

// var query = "";

// if( url.indexOf("person") != -1 ){
//   query = url.substring(url.indexOf("person")+7, url.length);
//   console.log(query);
// }

var root;

createGraph( query, 1 );

function createGraph( query, grade ){
  d3.json( data, function(error, graph) {
    if (error) throw error;

    // json = graph;

    if(query != ""){
      links = $.grep(graph.links, function(n, i){
        return ( n.source == query || n.target == query );
      });

      // store names for fitlering
      var nodes = [];

      for(var i=0; i<links.length; i++){
        if(links[i].source != query)
          nodes.push(links[i].source);
        else if(links[i].target != query)
          nodes.push(links[i].target);
      }

      persons  = $.grep(graph.nodes, function(n, i){
        return ( ($.inArray(n.id, nodes) != -1) || n.id==query )
      });
    } else {
      links = graph.links;
      persons = graph.nodes;
    }

    // if( grade != 1 ) {
    //   links = $.grep( links, function(n, i){ return parseInt(n.grade) >= grade; } );
    // }

    container = svg.append("g");
    container.attr("transform", "translate(400, 200)scale(0.5)");

    root = persons.find(function(p){ return p.id == query; });

    var link = container.append("g")
        .attr("class", "links")
      .selectAll("line")
      .data(links)//.data(graph.links)
      .enter().append("line")
        .attr( "stroke-width", function(d) { return d.grade; } )
        .attr( "source", function(d) { return d.source; } )
        .attr( "target", function(d) { return d.target; } )
        .attr( "grade", function(d) { return d.grade; } )
        .attr( "stroke", function(d) { var c = d.grade*10; c = 180-c; return "rgb("+c+", "+c+", "+c+")"; } )

    var node = container.append("g")
        .attr("class", "nodes")
      .selectAll("circle")
      .data(persons)//.data(graph.nodes)
      .enter().append("a").attr("xlink:href", function(d){ return baseurl + d.url; }).append("circle")
        .attr("stroke", "none")
        .attr("title", function(d) { return d.name; })
        .attr("data-id", function(d) { return d.id; })
        .attr("type", function(d) { return d.type; })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

      // if(root){
      //   root.x = width/2;
      //   root.y = height/2;
      //   root.fixed = true;
      // }

    node.append("title")
        .text(function(d) { return d.name; });

    $(".nodes circle").each(function(){
      var id = $(this).data("id");
      var r = 0;
      $('.links [source="'+id+'"]').each(function(){
        r += parseInt( $(this).attr("grade") );
      });
      $('.links [target="'+id+'"]').each(function(){
        r += parseInt( $(this).attr("grade") );
      });
      if(query==""){
        $(this).attr("r", 5 + r/8 );
      }
      else {
        r = r/2 + 5;
        if(r > 50) r = 60;
        $(this).attr("r", r );
      }
      // $(this).attr("r", 5 + ($(".links [source='"+id+"']").length + $(".links [target='"+id+"']").length)/7 );
    });

    simulation.nodes(persons)
        .on("tick", ticked)

    simulation.force("collide", d3.forceCollide().radius(function(d) {
              return $('.nodes circle[data-id="'+ d.id +'"]').attr("r");
            }).iterations(2)); // return 5 + ($(".links [source='"+d.id+"']").length + $(".links [target='"+d.id+"']").length)/7;

    simulation.force()

        // Just for debugging
        // console.log("Links");
        // console.log(graph.links);

    simulation.force("link")
        .links(links);

    function ticked() {
      link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    }

    if( query == "" ){
      $("line").each(function(){
        if( parseInt( $(this).attr("grade") ) < 2 ){
          $(this).hide();
        }
      });
    }
});
}


svg.call(d3.zoom()
    .scaleExtent([0.2, 10])
    .on("zoom", zoomed));

function zoomed(){
  var transform = d3.event.transform;
  container.attr("transform", "translate(" + transform.x + "," + transform.y + ")scale(" + transform.k + ")");
  // console.log("translate(" + transform.x + "," + transform.y + ")scale(" + transform.k + ")");
}


function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

// click on a circle
// $(document).on('click', 'circle', function(){
//   var name = $(this).attr("title");
//   query = $(this).data("id");
//   var url = window.location.href;
//   if( url.indexOf('#') != -1 ){
//     var base = url.substring(0, url.indexOf('#'));
//     window.location.href = base + "#" + query;
//     url = base;
//   } else {
//     window.location.href = url + "#" + query;
//   }
//
//   // $("svg").css({"margin-left": "-30%"})
//   $("svg>g").remove();
//   createGraph( query, 1 );
//   // var url = window.location.href;
//   // var q = url.indexOf("#");
//   // if(q!=-1) url = url.substring(0, q);
//   jQuery.get(url + '/persons/'+name+'.html', function(data) {
//       // console.log(data);
//       $(".personal-data").html("");
//       $(".personal-data").append(data);
//   });
// });

// $("circle").on('click', function(){
//   var name = $(this).attr("title");
//   query = $(this).attr("id");
//
//   console.log(name, id);
//
//   $("svg>g").remove();
//   createGraph( query );
//   // var url = window.location.href;
//   // var q = url.indexOf("#");
//   // if(q!=-1) url = url.substring(0, q);
//   // jQuery.get(url + '/persons/'+name+'.html', function(data) {
//   //     console.log(data);
//   // });
// });

$(document).keydown(function(e){
  // if( e.which === 90 ) {
  //   window.location.href += "#p=test";
  // }
});
