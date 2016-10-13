var baseurl = $("p#baseurl").text();

var svg = d3.select("#svg"),
    height = window.innerHeight - 85,
    width = window.innerWidth;
    // svg.attr("width", "100%")
    //   .attr("height", height);

var canvas = d3.select('#canvas')
    .attr('width', width)
    .attr('height', height);

var context = canvas.node().getContext('2d');

var container;
var data = baseurl+"/persons.json";

var links, persons;
var json;

// actual d3 objects
var link, node;

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation, trans, globalX, globalY;

var circles = [],
    lines = [];

var updateGraph;
var t = 1;

d3.json( data, function(error, graph) {
  if (error) throw error;

  json = graph;

  links = json.links;
  persons = json.nodes;

  simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }))
      .force("charge", d3.forceManyBody().strength(function(){ return -150 })) //if(query!="") return -800; else if(projectQuery != "") return -2000; else return -150;
      .force("center", d3.forceCenter(width / 2, height / 2))

  /*
  * collision detection
  */
  simulation.force("collide", d3.forceCollide().radius(function(d) {
            return (parseInt(d.nr_projects) + 5);
          }).iterations(2));

  simulation.alphaTarget(0.01);

  simulation.nodes(persons)
      .on("tick", ticked)

  simulation.force("link")
      .links(links);

  persons.forEach(function(d, i) {
      circles.push( new Circle(d) );
  });

  links.forEach(function(d, i) {
    lines.push( new Line(d.source, d.target, d.grade) );
  });

  canvas.call( d3.zoom().scaleExtent([0.2, 10]).on("zoom", zoomed) );
  trans = d3.zoomIdentity;
  trans.k = 0.5;
  trans.x = width/4;
  trans.y = height/4;

  function ticked(){
    // console.log("tick")
    // var t0 = performance.now();
    context.save();
  // Clear the complete figure.
    context.clearRect(0, 0, width, height);
    context.translate(trans.x, trans.y);
    context.scale(trans.k, trans.k);

    // Draw the links ...
    lines.forEach(function(d, i) {
        lines[i].display();
    });
    // Draw the nodes ...
    circles.forEach(function(d, i) {
      circles[i].display();
    });
    context.restore();
    // console.log(t--);
    // var t1 = performance.now();
    // console.log(t1-t0);
    if( t>0 ){
      t -= 0.1;
    }
  };

  function zoomed(d) {
    trans = d3.event.transform;
    ticked();
  }

  updateGraph = function( year ){
    // get projects
    var projects = $.grep( json.projects, function(n, i){
      return ( (n.start.substring(0, 4) <= year) && (n.end.substring(0, 4) >= year || n.end == "")  )
    } );
    // get persons involved in projects
    var relatedPersons = [];
    for( var i=0; i<projects.length; i++ ){
      var ps = projects[i].relatedPersons.split(", ");
      for( var j=0; j<ps.length; j++ ){
        // relatedPersons += ps[j].replace(/\s/g, ".");
        // relatedPersons += ", "
        relatedPersons.push( ps[j].replace(/\s/g, ".") );
      }
    }
    // clear person's list from duplicates
    var uRelPersons = [];
    $.each(relatedPersons, function(i, el){
        if( $.inArray(el, uRelPersons) === -1 ) uRelPersons.push(el);
    });

    $.grep( circles, function(n){ return uRelPersons.includes( n.id ); } ).forEach(function(n){ n.colorize() });
    $.grep( circles, function(n){ return !uRelPersons.includes( n.id ); } ).forEach(function(n){ n.fillStyle = "transparent"; n.opacity = 0; });

    $.grep( lines, function(n){
      return ( $.inArray(n.source.id, uRelPersons) != -1 ) && ( $.inArray(n.target.id, uRelPersons) != -1 )
    } ).forEach(function(n){ n.colorize(); });

    $.grep( lines, function(n){
      return ( $.inArray(n.source.id, uRelPersons) === -1 ) || ( $.inArray(n.target.id, uRelPersons) === -1 )
    } ).forEach(function(n){ n.strokeStyle = "transparent"; n.opacity = 0; })

    simulation.alpha(1);
  }

});

/*
* Track global mouse coordinates
*/
document.onmousemove = function(e){
  globalX = e.pageX;
  globalY = e.pageY;
}
/*
* Mouse click on nodes
*/
// document.getElementById("canvas").addEventListener('click', function(event){
//     var x = event.pageX,
//         y = event.pageY - $(".site-header").outerHeight();
//
//     x = (x - trans.x)/trans.k;
//     y = (y - trans.y)/trans.k;
//
//     for( var i=0; i<json.nodes.length; i++ ){
//       if(  (x-json.nodes[i].x)*(x-json.nodes[i].x) + (y-json.nodes[i].y)*(y-json.nodes[i].y) < (5 + parseInt(json.nodes[i].nr_projects))*(5 + parseInt(json.nodes[i].nr_projects)) ){
//         // alert( json.nodes[i].name );
//             $(".tooltip").show()
//                 $(".tooltip").css({ "position": "absolute", "top": p[1] - , "left": p[0], "opacity": "1" })
//                 $(".tooltip").text(closeNode.name)
//       }
//     }
// })
d3.select("canvas").on("click", function(d){
  var p = d3.mouse(this);
  p[0] = (p[0] - trans.x)/trans.k;
  p[1] = (p[1] - trans.y)/trans.k;
  closeNode = simulation.find(p[0], p[1]);
  if( ((p[0] - closeNode.x)*(p[0] - closeNode.x) + (p[1] - closeNode.y)*(p[1] - closeNode.y) < (5 + parseInt(closeNode.nr_projects))*(5 + parseInt(closeNode.nr_projects)) ) && (circles[closeNode.index].opacity != 0) ){
        // alert(closeNode)
    window.location.href = baseurl + "" +closeNode.url;
  }
});

/*
* Mouse hover over nodes
*/
d3.select("canvas").on("mousemove", function(d){
  var p = d3.mouse(this);
  p[0] = (p[0] - trans.x)/trans.k;
  p[1] = (p[1] - trans.y)/trans.k;
  closeNode = simulation.find(p[0], p[1]);
  if( ((p[0] - closeNode.x)*(p[0] - closeNode.x) + (p[1] - closeNode.y)*(p[1] - closeNode.y) < (5 + parseInt(closeNode.nr_projects))*(5 + parseInt(closeNode.nr_projects))) && (circles[closeNode.index].opacity != 0) ){
    $(".tooltip").show()
    $(".tooltip").css({ "position": "absolute", "top": globalY - 20, "left": globalX + 5, "opacity": "1" })
    $(".tooltip .tooltip-inner").text(closeNode.name)
  }
  else {
    $(".tooltip").hide();
  }
})
