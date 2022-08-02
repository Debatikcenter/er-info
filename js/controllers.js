var selectedNodes = [];
var deselectedNodes = [];
var activeNodes;
$(document).ready(function () {
  // event listener for sidebar filters; works for svg nodes
  $("button.profession-filter").click(function () {
    if (query == "") {
      $(this).toggleClass("active");
      $("line").css({ opacity: "1", transition: "opacity .5s ease" });
      var activeNodes = [];
      $(".active.profession-filter").each(function () {
        activeNodes.push($(this).attr("name"));
      });
      if (activeNodes.length == 7 || activeNodes.length == 0) {
        $("button.profession-filter").removeClass("active");
        $("circle").css({ opacity: "1", transition: "opacity .5s ease" });
      } else {
        $("circle").each(function () {
          var type = $(this).attr("type");
          if (activeNodes.indexOf(type) != -1) {
            $(this).css({ opacity: "1", transition: "opacity .5s ease" });
          } else {
            $(this).css({ opacity: "0", transition: "opacity .5s ease" });
            $('line[source="' + $(this).data("id") + '"]').css({
              opacity: "0",
              transition: "opacity .5s ease",
            });
            $('line[target="' + $(this).data("id") + '"]').css({
              opacity: "0",
              transition: "opacity .5s ease",
            });
          }
        });
      }
    } else {
      $(this).toggleClass("active");
      $("line").css({ opacity: "0", transition: "opacity .5s ease" });
      var activeNodes = [];
      $(".active.profession-filter").each(function () {
        activeNodes.push($(this).attr("name"));
      });
      if (activeNodes.length == 7 || activeNodes.length == 0) {
        $("button.profession-filter").removeClass("active");
        $("circle").css({ opacity: "1", transition: "opacity .5s ease" });
        $("line").css({ opacity: "1", transition: "opacity .5s ease" });
      } else {
        $("circle:not([data-id='" + query + "'])").each(function () {
          var type = $(this).attr("type");
          if (activeNodes.indexOf(type) != -1) {
            $(this).css({ opacity: "1", transition: "opacity .5s ease" });
            $('line[source="' + $(this).data("id") + '"]').css({
              opacity: "1",
              transition: "opacity .5s ease",
            });
            $('line[target="' + $(this).data("id") + '"]').css({
              opacity: "1",
              transition: "opacity .5s ease",
            });
          } else {
            $(this).css({ opacity: "0", transition: "opacity .5s ease" });
          }
        });
      }
    }
  });

  // event listener canvas rendering
  $("button.profession-filter-canvas").click(function () {
    $(this).toggleClass("active");

    activeNodes = [];
    $(".active.profession-filter-canvas").each(function () {
      activeNodes.push($(this).attr("name"));
    });
    console.log(activeNodes);
    if (activeNodes.length == 7 || activeNodes.length == 0) {
      $("button.profession-filter-canvas").removeClass("active");
      // circles.forEach(function(n){ n.colorize() })
      for (var i = 0; i < circles.length; i++) {
        circles[i].colorize();
      }
      for (var i = 0; i < lines.length; i++) {
        lines[i].colorize();
      }
    } else {
      // setTimeout(function(){
      $.grep(circles, function (n) {
        return $.inArray(n.type, activeNodes) != -1;
      }).forEach(function (n) {
        n.colorize();
      });
      $.grep(circles, function (n) {
        return $.inArray(n.type, activeNodes) === -1;
      }).forEach(function (n) {
        n.fillStyle = "transparent";
        n.opacity = 0; /*n.fadeOut();*/
      });

      $.grep(lines, function (n) {
        return (
          $.inArray(n.source.type, activeNodes) != -1 &&
          $.inArray(n.target.type, activeNodes) != -1
        );
      }).forEach(function (n) {
        n.colorize();
      });

      $.grep(lines, function (n) {
        return (
          $.inArray(n.source.type, activeNodes) === -1 ||
          $.inArray(n.target.type, activeNodes) === -1
        );
      }).forEach(function (n) {
        n.strokeStyle = "transparent";
        n.opacity = 0;
      });
      // }, 100)

      // if($(this).hasClass('active')){
      //
      //
      //   // for( var i=0; i<circles.length; i++ ){
      //   //   if( circles[i].type == $(this).attr("name") ){
      //   //     circles[i].fillStyle = "transparent";
      //   //     var id = circles[i].id;
      //   //     $.grep(lines, function(n, i){ return (n.source.id == id) || (n.target.id == id) }).forEach(function(n){ n.strokeStyle = "transparent" })
      //   //   }
      //   // }
      // } else {
      //   for( var i=0; i<circles.length; i++ ){
      //     if( circles[i].type == $(this).attr("name") ){
      //       circles[i].colorize();
      //       var id = circles[i].id;
      //       $.grep(lines, function(n, i){ return (n.source.id == id) || (n.target.id == id) }).forEach(function(n){ n.strokeStyle = "#999" })
      //     }
      //   }
      // }
    }
  });

  $(".slider input").change(function () {
    var val = $(this).val();
    $(".slider span").text(val);
    // links = $.grep( links, function(n, i){ return parseInt(n.grade) >= val; } );
    // simulation.restart();
    for (var i = 0; i < lines.length; i++) {
      if (parseInt(lines[i].grade) < val) lines[i].strokeStyle = "transparent";
      else lines[i].colorize();
    }
  });

  function createSliderMarks() {
    var min = 1991;
    var max = $(".timeline input").attr("max");
    var w = $(".timeline input").width();

    var year = min;
    for (var i = 0; i <= max - min; i++) {
      //
      $(".timeline .years").append(
        "<span data-year=" +
          (min + i) +
          " style='position: absolute; top: -30px; left: " +
          ((i * (w - 20)) / (max - min) - 5) +
          "px;'>" +
          (min + i) +
          "</span>"
      );
      year++;
    }
  }
  $(".timeline .years").on("click", "span", function () {
    $(".timeline input").val($(this).data("year"));
    updateGraph($(this).data("year"));
  });
  $(".timeline input").change(function () {
    updateGraph($(this).val());
  });

  createSliderMarks();
});
