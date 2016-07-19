var svg = d3.select("#svg"),
    width = window.innerWidth,
    height = window.innerHeight;
    svg.attr("width", width-10)
      .attr("height", height-65);

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody().strength(-130))
    .force("center", d3.forceCenter(width / 2, height / 2));

// var zoom = d3.behavior.zoom()
svg.call(d3.zoom()
.scaleExtent([0.1, 10])
.on("zoom", zoomed));

function zoomed(){
  // console.log(d3.event.translate);
  // console.log(d3.event.scale);
  // var transform = d3.transform();
  //
  // svg.attr("transform", "translate(" + transform.x + "," + transform.y + ")scale(" + transform.k + ")");
}

d3.json("../persons.json", function(error, graph) {
  if (error) throw error;

  var container = svg.append("g");

  var link = container.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
      .attr( "stroke-width", "1" )
      .attr( "source", function(d) { return d.source; } )
      .attr( "target", function(d) { return d.target; } )
      .attr( "project", function(d) { return d.project;  } )
      .attr( "year", function(d){ return d.year; } );

      // console.log("Nodes");
      // console.log(graph.nodes);
  var node = container.append("g")
      .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
      // .attr("r", function(d) { return 5 + d.connections*2; })
      // .attr("fill", "white") //function(d) { return color(d.group); })
      .attr("stroke", "none")
      .attr("title", function(d) { return d.name; })
      .attr("data-id", function(d) { return d.id; })
      .attr("type", function(d) { return d.type; })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  node.append("title")
      .text(function(d) { return d.name; });

      $(".nodes circle").each(function(){
        // var id = $(this).attr("title");
        var id = $(this).data("id");
        // while(id.indexOf(" ")!=-1){
        //   id = id.replace(" ", ".");
        // }
        //  var id = $(this).attr("title").replace(/\s/, ".");
        //  $(this).attr("r", 5 + 2*Math.sqrt($(".links [source='"+id+"']").length + $(".links [target='"+id+"']").length) );
         $(this).attr("r", 5 + ($(".links [source='"+id+"']").length + $(".links [target='"+id+"']").length)/7 );
      });

  simulation.nodes(graph.nodes)
      .on("tick", ticked)

  // simulation.force("collide", d3.forceCollide().radius(function(d) { return 2*d.r; }).iterations(2));
  simulation.force("collide", d3.forceCollide().radius(function(d) {
            // return 5 + ($(".links [source='"+d.id+"']").length + $(".links [target='"+d.id+"']").length)/7;
            return $(".nodes circle[data-id='"+ d.id +"']").attr("r");
          }).iterations(2));

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

  $("circle").on('click', function(){
    var name = $(this).attr("title");
    var url = window.location.href;
    var q = url.indexOf("?");
    if(q!=-1) url = url.substring(0, q);
    jQuery.get(url + '/persons/'+name+'.html', function(data) {
        console.log(data);
    });
  });

  $(document).keydown(function(e){
  if( e.which === 90 ) {
    window.location.href += "#p=test";
  }
});


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
