var baseurl = $("p#baseurl").text();

var svg = d3.select("#svg"),
  height = window.innerHeight - 65;
svg.attr("width", "100%").attr("height", height);

var width = parseInt($("#svg").css("width"), 10);

var container;
var data = baseurl + "/persons.json";

var links = [],
  persons = [];
var json;

// actual d3 objects
var link, node;

var query = $("#query").text();
var projectQuery = $("#project-name").text();
var url = window.location.href;

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3
  .forceSimulation()
  .force(
    "link",
    d3.forceLink().id(function (d) {
      return d.id;
    })
  )
  .force(
    "charge",
    d3.forceManyBody().strength(function () {
      if (query != "") return -800;
      else if (projectQuery != "") return -2000;
      else return -150;
    })
  )
  .force("center", d3.forceCenter(width / 2, height / 2));
// .alphaTarget( function(){ if( query == "" ) return 0.2; else return 0.1 } )

if (query == "") {
  simulation.alphaTarget(0.1);
} else {
  simulation.alphaTarget(0.05);
}

// var query = "";

// if( url.indexOf("person") != -1 ){
//   query = url.substring(url.indexOf("person")+7, url.length);
//   console.log(query);
// }

var root;

createGraph(query, 1);

function createGraph(query, grade) {
  d3.json(data, function (error, graph) {
    if (error) throw error;

    json = graph;

    /*
     * person filter
     */
    if (query != "") {
      personGraph(graph);
    } else if (projectQuery != "") {
      /*
       * project filter
       */
      projectGraph(graph);
    } else {
      /*
       * home page; apply timeline filter
       */
      var projects = $.grep(graph.projects, function (n, i) {
        return true; //n.start.substring(0, 4) <= 2009;
      });

      // store names for fitlering
      var nodes = [];

      for (var i = 0; i < links.length; i++) {
        if (links[i].source != query) nodes.push(links[i].source);
        else if (links[i].target != query) nodes.push(links[i].target);
      }

      persons = $.grep(graph.nodes, function (n, i) {
        return $.inArray(n.id, nodes) != -1 || n.id == query;
      });
    }
    /*
     * project filter
     */
    // else if( projectQuery != "" ) {
    //   var relatedPersons = $("#related-persons li").text();
    //   persons = $.grep( graph.nodes, function(n, i){
    //     return ( relatedPersons.indexOf( n.id ) != -1 );
    //   } );
    //   links = $.grep( graph.links, function(n, i){
    //     return (relatedPersons.indexOf( n.source ) != -1) && (relatedPersons.indexOf( n.target ) != -1)
    //   } );
    // }
    // /*
    // * home page; apply timeline filter
    // */
    // else {
    //   var projects = $.grep( graph.projects, function(n, i){
    //     return ( (n.start.substring(0, 4) <= 2009)  )
    //   } )
    //   var relatedPersons = [];
    //   for( var i=0; i<projects.length; i++ ){
    //     var ps = projects[i].relatedPersons.split(", ");
    //     for( var j=0; j<ps.length; j++ ){
    //       // relatedPersons += ps[j].replace(/\s/g, ".");
    //       // relatedPersons += ", "
    //       relatedPersons.push( ps[j].replace(/\s/g, ".") );
    //     }
    //   }
    //   var uRelPersons = [];
    //   $.each(relatedPersons, function(i, el){
    //       if( $.inArray(el, uRelPersons) === -1 ) uRelPersons.push(el);
    //   });

    //   persons = $.grep( graph.nodes, function(n, i){
    //     return ( relatedPersons.indexOf( n.id ) != -1 );
    //   } );

    //   links = $.grep( graph.links, function(n, i){
    //     return (relatedPersons.indexOf( n.source ) != -1) && (relatedPersons.indexOf( n.target ) != -1)
    //   } );
    //   // links = graph.links;
    //   // persons = graph.nodes;
    // }

    // if( grade != 1 ) {
    //   links = $.grep( links, function(n, i){ return parseInt(n.grade) >= grade; } );
    // }

    container = svg.append("g");

    /*
     * zoom ouot if in front page
     */
    if (query == "" && projectQuery == "") {
      container.attr("transform", "translate(400, 200)scale(0.5)");
    }

    // root = persons.find(function(p){ return p.id == query; });

    /*
     * create links
     */
    link = container
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links) //.data(graph.links)
      .enter()
      .append("line")
      .attr("stroke-width", function (d) {
        return d.grade;
      })
      .attr("source", function (d) {
        return d.source;
      })
      .attr("target", function (d) {
        return d.target;
      })
      .attr("grade", function (d) {
        return d.grade;
      })
      .attr("stroke", function (d) {
        var c = d.grade * 10;
        c = 180 - c;
        return "rgb(" + c + ", " + c + ", " + c + ")";
      });

    link.exit().remove();

    /*
     * create nodes
     */
    node = container
      .append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(persons) //.data(graph.nodes)
      .enter()
      .append("a")
      .attr("class", "person-node")
      .attr("xlink:href", function (d) {
        return baseurl + d.url;
      })
      .append("circle")
      .attr("stroke", "none")
      .attr("title", function (d) {
        return d.name;
      })
      .attr("data-id", function (d) {
        return d.id;
      })
      .attr("type", function (d) {
        return d.type;
      })
      .attr("years", function (d) {
        var s = d.years.split("/");
        var years = "";
        for (var i = 0; i < s.length; i++) {
          var y = s[i].split("-");
          years = years + y[0] + ",";
        }
        return years;
      })
      .attr("r", function (d) {
        if (query == "") {
          return 5 + parseInt(d.nr_projects);
        } else {
          if (5 + parseInt(d.nr_projects) > 60) return 60;
          else return 5 + parseInt(d.nr_projects);
        }
      })
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    node.exit().remove();

    node.append("title").text(function (d) {
      return d.name;
    });

    if (query != "") {
      $("circle[data-id='" + query + "']")
        .closest("a")
        .attr("root", "true");
      console.log("done");
    }

    simulation.nodes(persons).on("tick", ticked);

    /*
     * collision detection
     */
    simulation.force(
      "collide",
      d3
        .forceCollide()
        .radius(function (d) {
          return $('.nodes circle[data-id="' + d.id + '"]').attr("r");
        })
        .iterations(2)
    ); // return 5 + ($(".links [source='"+d.id+"']").length + $(".links [target='"+d.id+"']").length)/7;

    simulation.force("link").links(links);

    // hide grade 1 connections by default
    if (query == "" && projectQuery == "") {
      $("line").each(function () {
        if (parseInt($(this).attr("grade")) < 2) {
          $(this).hide();
        }
      });
    }

    $(document).keydown(function (e) {
      // if( e.which === 90 ) {
      //   // console.log(node.groups.attributes.title.nodeValue)
      //   node._groups[0].splice(33, 1);
      // } else {
      //   globalNodes = node;
      // }
    });
  });
}

function personGraph(graph) {
  links = $.grep(graph.links, function (n, i) {
    return n.source == query || n.target == query;
  });

  // store names for fitlering
  var nodes = [];

  for (var i = 0; i < links.length; i++) {
    if (links[i].source != query) nodes.push(links[i].source);
    else if (links[i].target != query) nodes.push(links[i].target);
  }

  persons = $.grep(graph.nodes, function (n, i) {
    return $.inArray(n.id, nodes) != -1 || n.id == query;
  });

  // persons.forEach(function(d, i) {
  //     circles.push( new Circle(d) );
  // });

  // links.forEach(function(d, i) {
  //   lines.push( new Line(d.source, d.target, d.grade) );
  // });
}

function projectGraph(graph) {
  var relatedPersons = $("#related-persons li").text();
  persons = $.grep(graph.nodes, function (n, i) {
    return relatedPersons.indexOf(n.id) != -1;
  });
  links = $.grep(graph.links, function (n, i) {
    return (
      relatedPersons.indexOf(n.source) != -1 &&
      relatedPersons.indexOf(n.target) != -1
    );
  });
}

function setupGraph(container) {
  /*
   * create links
   */
  link = container
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links, function (d) {
      return d.source.id + "-" + d.target.id;
    }) //.data(graph.links)
    .enter()
    .append("line")
    .attr("stroke-width", function (d) {
      return d.grade;
    })
    .attr("source", function (d) {
      return d.source;
    })
    .attr("target", function (d) {
      return d.target;
    })
    .attr("grade", function (d) {
      return d.grade;
    })
    .attr("stroke", function (d) {
      var c = d.grade * 10;
      c = 180 - c;
      return "rgb(" + c + ", " + c + ", " + c + ")";
    });

  link.exit().remove();

  /*
   * create nodes
   */
  node = container
    .append("g")
    .attr("class", "nodes")
    .selectAll("a")
    .data(persons, function (d) {
      return d.id;
    }); //.data(graph.nodes)

  node.exit().remove();

  const nodeEnter = node
    .enter()
    .append("a")
    .attr("class", "person-node")
    .attr("xlink:href", function (d) {
      return baseurl + d.url;
    })
    .append("circle")
    .attr("stroke", "none")
    .attr("title", function (d) {
      return d.name;
    })
    .attr("data-id", function (d) {
      return d.id;
    })
    .attr("type", function (d) {
      return d.type;
    })
    .attr("years", function (d) {
      var s = d.years.split("/");
      var years = "";
      for (var i = 0; i < s.length; i++) {
        var y = s[i].split("-");
        years = years + y[0] + ",";
      }
      return years;
    })
    .attr("r", function (d) {
      if (query == "") {
        return 5 + parseInt(d.nr_projects);
      } else {
        if (5 + parseInt(d.nr_projects) > 60) return 60;
        else return 5 + parseInt(d.nr_projects);
      }
    })
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

  node = node.merge(nodeEnter);

  node.append("title").text(function (d) {
    return d.name;
  });

  if (query != "") {
    $("circle[data-id='" + query + "']")
      .closest("a")
      .attr("root", "true");
    console.log("done");
  }

  simulation.nodes(persons).on("tick", ticked);

  /*
   * collision detection
   */
  simulation.force(
    "collide",
    d3
      .forceCollide()
      .radius(function (d) {
        return $('.nodes circle[data-id="' + d.id + '"]').attr("r");
      })
      .iterations(2)
  ); // return 5 + ($(".links [source='"+d.id+"']").length + $(".links [target='"+d.id+"']").length)/7;

  simulation.force("link").links(links);
}

function ticked() {
  link
    .attr("x1", function (d) {
      return d.source.x;
    })
    .attr("y1", function (d) {
      return d.source.y;
    })
    .attr("x2", function (d) {
      return d.target.x;
    })
    .attr("y2", function (d) {
      return d.target.y;
    });

  node
    .attr("cx", function (d) {
      return d.x;
    })
    .attr("cy", function (d) {
      return d.y;
    });
}

var globalNodes;
/*
 * zoom functionality
 */
svg.call(d3.zoom().scaleExtent([0.2, 10]).on("zoom", zoomed));

function zoomed() {
  var transform = d3.event.transform;
  container.attr(
    "transform",
    "translate(" +
      transform.x +
      "," +
      transform.y +
      ")scale(" +
      transform.k +
      ")"
  );
  // console.log("translate(" + transform.x + "," + transform.y + ")scale(" + transform.k + ")");
}

/*
 * dragginh events
 */
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

function restart() {
  // Apply the general update pattern to the nodes.
  node = node.data(nodes, function (d) {
    return d.id;
  });
  node.exit().remove();
  node = node
    .enter()
    .append("circle")
    .attr("fill", function (d) {
      return color(d.id);
    })
    .attr("r", 8)
    .merge(node);

  // Apply the general update pattern to the links.
  link = link.data(links, function (d) {
    return d.source.id + "-" + d.target.id;
  });
  link.exit().remove();
  link = link.enter().append("line").merge(link);

  // Update and restart the simulation.
  simulation.nodes(nodes);
  simulation.force("link").links(links);
  simulation.alpha(1).restart();
}
