var svg = d3.select("#svg"),
    width = window.innerWidth,
    height = window.innerHeight;
    svg.attr("width", width)
      .attr("height", height);

console.log(svg);

var color = d3.scaleOrdinal(d3.schemeCategory20);
console.log(color);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(width / 2, height / 2));

d3.json("js/persons.json", function(error, graph) {
  if (error) throw error;

  var link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
      .attr("stroke-width", function(d) { return Math.sqrt(d.value); })
      .attr("source", function(d) { return d.source; } )
      .attr("target", function(d) { return d.target; } );

  var node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
      // .attr("r", function(d) { return 5 + d.connections*2; })
      // .attr("fill", "white") //function(d) { return color(d.group); })
      .attr("stroke", "none")
      .attr("title", function(d) { return d.name; })
      .attr("type", function(d) { return d.type; })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  node.append("title")
      .text(function(d) { return d.name; });

      var regex = new RegExp("/\s/", 'g');
      $(".nodes circle").each(function(){
        var id = $(this).attr("title");
        while(id.indexOf(" ")!=-1){
          id = id.replace(" ", ".");
        }
        //  var id = $(this).attr("title").replace(/\s/, ".");
         $(this).attr("r", 5 + 2*Math.sqrt($(".links [source='"+id+"']").length + $(".links [target='"+id+"']").length) );
      });

  simulation.nodes(graph.nodes)
      .on("tick", ticked);

      console.log("Links");
      console.log(graph.links);
      // try{
      //   simulation.force("links")
      //       .links(graph.links);
      // } catch(e) {
      //   return;
      // }
      // console.log($(".links [source='Edi.Rama']"));
      // console.log($(".links [target='Edi.Rama']"));
        simulation.force("link")
            .links(graph.links);


  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

    var i = 0,
        n = node.length;

    while (++i < n) q.visit(collide(node[i]));
  }
});

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

function collide(node) {
  var r = node.radius + 100,
      nx1 = node.x - r,
      nx2 = node.x + r,
      ny1 = node.y - r,
      ny2 = node.y + r;
  return function(quad, x1, y1, x2, y2) {
    if (quad.point && (quad.point !== node)) {
      var x = node.x - quad.point.x,
          y = node.y - quad.point.y,
          l = Math.sqrt(x * x + y * y),
          r = node.radius + quad.point.radius;
      if (l < r) {
        l = (l - r) / l * .5;
        node.x -= x *= l;
        node.y -= y *= l;
        quad.point.x += x;
        quad.point.y += y;
      }
    }
    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
  };
}
