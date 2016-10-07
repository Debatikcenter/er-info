var baseurl = $("p#baseurl").text();

var svg = d3.select("#svg"),
    height = window.innerHeight - 65,
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

d3.json( data, function(error, graph) {
  if (error) throw error;

  json = graph;

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

simulation.nodes(json.nodes)
    .on("tick", ticked)

simulation.force("link")
    .links(json.links);

json.nodes.forEach(function(d, i) {
    // Draws a complete arc for each node.
    // context.beginPath();
    // context.arc(d.x, d.y, d.radius, 0, 2 * Math.PI, true);
    // context.fill();
    // circles.push( new Circle(d.x, d.y, d.nr_projects, d.name, d.id, d.type, d.url) );
    circles.push( new Circle(d) );
});

json.links.forEach(function(d, i) {
  lines.push( new Line(d.source, d.target) );
});

canvas.call( d3.zoom().scaleExtent([0.2, 10]).on("zoom", zoomed) );
trans = d3.zoomIdentity;

function ticked(){
  // console.log("tick")
  context.save();
// Clear the complete figure.
  context.clearRect(0, 0, width, height);
  context.translate(trans.x, trans.y);
  context.scale(trans.k, trans.k);

  // Draw the links ...
  json.links.forEach(function(d, i) {
      // Draw a line from source to target.
      // context.beginPath();
      // context.moveTo(d.source.x, d.source.y);
      // context.lineTo(d.target.x, d.target.y);
      // if( d.grade < 2 ) context.strokeStyle = "transparent";
      // else context.strokeStyle = "#999";
      // context.stroke();
      lines[i].display();
  });
  // Draw the nodes ...
  json.nodes.forEach(function(d, i) {
    // circles[i].update(d.x, d.y);
    circles[i].display();
    // Draws a complete arc for each node.
    // context.beginPath();
    // context.arc(d.x, d.y, d.radius, 0, 2 * Math.PI, true);
    // context.fill();
  });
  context.restore();
};

function zoomed(d) {
  trans = d3.event.transform;
  ticked();
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
  console.log(d);
  var p = d3.mouse(this);
  p[0] = (p[0] - trans.x)/trans.k;
  p[1] = (p[1] - trans.y)/trans.k;
  closeNode = simulation.find(p[0], p[1]);
  if( ((p[0] - closeNode.x)*(p[0] - closeNode.x) + (p[1] - closeNode.y)*(p[1] - closeNode.y) < (5 + parseInt(closeNode.nr_projects))*(5 + parseInt(closeNode.nr_projects)) ) && (circles[closeNode.index].opacity != 0) ){
        // alert(closeNode)
    window.location.href = closeNode.url;
  }
});

d3.select("canvas").on("mousemove", function(d){
  var p = d3.mouse(this);
  p[0] = (p[0] - trans.x)/trans.k;
  p[1] = (p[1] - trans.y)/trans.k;
  closeNode = simulation.find(p[0], p[1]);
  if( (p[0] - closeNode.x)*(p[0] - closeNode.x) + (p[1] - closeNode.y)*(p[1] - closeNode.y) < (5 + parseInt(closeNode.nr_projects))*(5 + parseInt(closeNode.nr_projects))){

    // context.strokeStyle = "#555";
    // context.font = '12px sans-serif';
    // context.textBaseline = 'bottom';
    // context.strokeText("Hello", p[0], p[1]);
    $(".tooltip").show()
    $(".tooltip").css({ "position": "absolute", "top": globalY - 15, "left": globalX, "opacity": "1" })
    $(".tooltip").text(closeNode.name)
  }
  else {
    $(".tooltip").hide();
  }
})

function Circle(d){ /* x, y, radius, name, id, type, url */
  this.radius = 5 + parseInt(d.nr_projects);
  this.name = d.name;
  this.id = d.id;
  this.type = d.type;
  this.udl = d.url;
  this.fillStyle;
  this.opacity = 1;
  this.data = d;


  this.colorize = function(){
    switch( this.type ){
      case 'architect': this.fillStyle = "rgba(255, 220, 1, "+this.opacity+")";
      break;
      case 'artist': this.fillStyle = "rgba(239, 80, 50, "+this.opacity+")";
      break;
      case 'curator': this.fillStyle = "rgba(126, 63, 152, "+this.opacity+")";
      break;
      case 'bureaucrat': this.fillStyle = "rgba(0, 147, 208, "+this.opacity+")";
      break;
      case 'politician': this.fillStyle = "rgba(193, 215, 47, "+this.opacity+")";
      break;
      case 'entrepreneur': this.fillStyle = "rgba(0, 107, 9, "+this.opacity+")";
      break;
      case 'other': this.fillStyle = "rgba(144, 87, 0, "+this.opacity+")";
      break;
    }
  }
  this.colorize();

  this.display = function(){
    context.beginPath();
    context.arc(this.data.x, this.data.y, this.radius, 0, 2 * Math.PI, true);
    context.fillStyle = this.fillStyle
    context.fill();
  }

  this.update = function(x, y){
    this.x = x;
    this.y = y;
  }

  this.fadeOut = function(){
    console.log("test")
    console.log(this.opacity)
    var that = this;
    var fade = setInterval(function(){
      if( that.opacity > 0 )
        that.opacity = that.opacity - 0.05;
      else that.opacity = 0;
      console.log(that.opacity)
    }, 10);
    setTimeout(function(){
      clearInterval(fade);
      console.log("stopped")
    }, 500)
    this.colorize();
  }

  // this.drag = function(mx, my){
  //   if( ( (mx-this.x)*(mx-this.x) + (my-this.y)*(my-this.y) ) < this.radius*this.radius ){
  //     update(mx, my);
  //   }
  // }
}

function Line(s, t){
  this.source = s;
  this.target = t;
  this.strokeStyle = "#999";

  this.display = function(){
    context.beginPath();
    // context.moveTo(this.sourceX, this.sourceY);
    // context.lineTo(this.targetX, this.targetY);
    context.moveTo(this.source.x, this.source.y);
    context.lineTo(this.target.x, this.target.y);

    context.strokeStyle = this.strokeStyle;
    context.stroke();
  }

  this.colorize = function(){
    this.strokeStyle = "#999";
  }
}
