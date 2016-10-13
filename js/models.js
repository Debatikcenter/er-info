/*
* Persons class (circles)
*/
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
      case 'architect': this.fillStyle = "rgb(255, 220, 1)"; //+this.opacity+")";
      break;
      case 'artist': this.fillStyle = "rgb(239, 80, 50)"; //+this.opacity+")";
      break;
      case 'curator': this.fillStyle = "rgb(126, 63, 152)"; //+this.opacity+")";
      break;
      case 'bureaucrat': this.fillStyle = "rgb(0, 147, 208)"; //+this.opacity+")";
      break;
      case 'politician': this.fillStyle = "rgb(193, 215, 47)"; //+this.opacity+")";
      break;
      case 'entrepreneur': this.fillStyle = "rgb(0, 107, 9)"; //+this.opacity+")";
      break;
      case 'other': this.fillStyle = "rgb(144, 87, 0)"; //+this.opacity+")";
      break;
    }
    this.opacity = 1;
  }
  this.colorize();

  this.display = function(){
    context.save();
    context.beginPath();
    context.arc(this.data.x, this.data.y, this.radius, 0, 2 * Math.PI, true);
    context.globalAlpha = this.opacity;
    context.fillStyle = this.fillStyle
    context.fill();
    context.restore();
  }

  this.update = function(x, y){
    this.x = x;
    this.y = y;
  }

  this.fadeOut = function(){
    var that = this;
    var fade = setInterval(function(){
      if( that.opacity > 0 )
        that.opacity = that.opacity*0.8;
      else that.opacity = 0;
    }, 20);
    setTimeout(function(){
      clearInterval(fade);
    }, 500);
  }

  this.fadeIn = function(){
    var that = this;
    if( that.opacity == 0 ){
      that.opacity = 0.1;
      var t = 0;
      var fade = setInterval(function(){
        if( t<1/*that.opacity <= 1*/ ){
          that.opacity = 1*t; //that.opacity*1.2;
          t += 0.05;
        }
        else t=1;//that.opacity = 1;
      }, 20);
      setTimeout(function(){
        clearInterval(fade);
      }, 500);
    }
  }

  // this.drag = function(mx, my){
  //   if( ( (mx-this.x)*(mx-this.x) + (my-this.y)*(my-this.y) ) < this.radius*this.radius ){
  //     update(mx, my);
  //   }
  // }
}


/*
* Connections class (lines)
*/
function Line(s, t, g){
  this.source = s;
  this.target = t;
  this.grade = g;
  this.strokeStyle = (g >= 2) ? "rgba(143, 143, 143, 0.5)" : "transparent";
  this.opacity = 0.6;

  this.display = function(){
    context.beginPath();
    // context.moveTo(this.sourceX, this.sourceY);
    // context.lineTo(this.targetX, this.targetY);
    context.moveTo(this.source.x, this.source.y);
    context.lineTo(this.target.x, this.target.y);

    context.strokeStyle = this.strokeStyle;
    context.lineWidth = this.grade;
    context.stroke();
  }

  this.colorize = function(){
    this.strokeStyle = "rgba(143, 143, 143, 0.5)";
    this.opacity = 1;
  }
}
