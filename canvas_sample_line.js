var canvas_data = function(){
  this.xaxis = new Array;
  this.yaxis = new Array;
  this.zaxis = new Array;
};

var canvas_point = function(){
  this.x = 0;
  this.y = 0;

  this.set = function(x,y){
    this.x = x;
    this.y = y;
  };
};


// Scale 操作
var canvas_scale = function(){
  this.domain = [0,1];
  this.range = [0,1];
  this.ratio = 1;

  this.setDomain = function(domain){
    this.domain = domain;
    this.setRatio();
    return this;
  };

  this.setRange = function(range){
    this.range = range;
    this.setRatio();
    return this;
  };

  this.setRatio = function(){
    this.ratio = (this.range[1]-this.range[0])/(this.domain[1]-this.domain[0]);
  };

  this.convert = function(val){
    return (val-this.domain[0])*this.ratio;    
  };

};


var canvas_range = function(){
  // 範囲
  this.min = 0;
  this.max = 1;
  this.deft = true; 

  this.set = function(x,y){
    this.min = x;
    this.max = y;
    this.deft = false; 
  };
};

var canvas_font = function(){
};

// 目盛り
var canvas_tick = function(){
  this.val = new Array;
  this.str = new Array;
  this.size = 8;
  this.deft = true;

  this.font = 'Times New Roman';
  this.font_size = 18;
  this.font_size_unit = "px";
  this.font_margin = this.font_size * 1.2;
  this.font_color = '#000';

  this.set = function(ary){
    this.val = ary;
    this.deft = false;
    return this;
  };

  this.get = function(n){
    if(this.str.length > 0){
      return this.str[n];
    }else{
      return this.val[n];
    }
  };

  this.setStr = function(str_ary){
    if(this.val.length == str_ary.length){
      this.str = str_ary;
    }    
    return this;
  };

  this.setFont = function(size,size_unit,font){
    this.font_size = size;
    this.font_size_unit = size_unit;
    this.font = font;
    return this;
  };

  this.getFont = function(){
    return this.font_size+this.font_size_unit+' '+this.font;
  };
};

// Style
var canvas_style = function(){
  this.color = "rgba(00,00,00,1)";
  this.width = "1";
};


var canvas_graph = function (canvasId){
  // parameter
  this.id = canvasId;
  this.canvas = document.getElementById(this.id);

  this.cbg = false;

  this.padding = 50;
  this.width = this.canvas.width-this.padding*2;
  this.height = this.canvas.height-this.padding*2;
  this.bgcolor = "rgba(255,255,255,1)";


  // 軸
  this.xrange = new canvas_range();
  this.yrange = new canvas_range();
  this.axes_draw = false;

  this.xscale = new canvas_scale();
  this.yscale = new canvas_scale();

  this.xtick = new canvas_tick();
  this.ytick = new canvas_tick();


  this.clear = function(){
    var context = this.canvas.getContext('2d');
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };  
  
  // 背景描画
  this.ground = function(){
    var context = this.canvas.getContext('2d');
    var style = new canvas_style();
    
    // canvas全体の背景
    if(this.cbg){
      context.fillStyle = this.bgcolor;
      context.fillRect(0,0,this.canvas.width,this.canvas.height);
    }
    // グラフ背景
    context.fillStyle = this.bgcolor;
    context.fillRect(this.padding,this.padding,
		     this.width,this.height);
    context.strokeRect(this.padding,this.padding,
		       this.width,this.height);
    context.lineWidth = 0.7;
  };
  

  // 軸の描画
  this.axes = function(data){
    // 軸の範囲を自動設定
    this.ground();
    if (this.xrange.deft){
      this.xrange.max = Math.max.apply(null,data.xaxis);
      this.xrange.min = Math.min.apply(null,data.xaxis);
    }
    if (this.yrange.deft){
      this.yrange.max = Math.max.apply(null,data.yaxis);
      this.yrange.min = Math.min.apply(null,data.yaxis);
    }

    // scaleの設定
    this.xscale
      .setDomain([this.xrange.min,this.xrange.max])
      .setRange([this.padding,this.padding+this.width]);
    this.yscale
      .setDomain([this.yrange.min,this.yrange.max])
      .setRange([this.padding,this.padding+this.height]);

    // 目盛り
    this.tickdraw();

    // 設定終了フラグ
    this.axes_draw = true;
  };

  // 目盛り描画
  this.tickdraw = function(){
    // 目盛りの自動設定
    this.tick_set();

    // 描画
    this.xtickdraw();
    this.ytickdraw();
    var context = this.canvas.getContext('2d');
    context.fillStyle = this.bgcolor;
    context.fillRect(this.padding+this.xtick.size,
		     this.padding+this.ytick.size,
		     this.width-this.xtick.size*2,
		     this.height-this.ytick.size*2);
  };
  
  this.tick_set = function(){
    var del;

    if(this.xtick.deft){
      var xticknum = 10;
      del = (this.xrange.max - this.xrange.min)/xticknum;
      
      for(var i=0; i<= xticknum; i++ ){
	this.xtick.val.push(this.xrange.min+del*i);
      }
    }

    if(this.ytick.deft){
      var yticknum = 10;
      del = (this.yrange.max - this.yrange.min)/yticknum;
      for(var j=0; j <= yticknum; j++ ){
	this.ytick.val.push(this.yrange.min+del*j);
      }
    }
  };

  this.xtickdraw = function(){
    var context = this.canvas.getContext('2d');
    var startp = new canvas_point;
    var endp = new canvas_point;

    var str;
    var tk ;

    startp.set(this.padding,this.padding);
    endp.set(this.padding, this.padding+this.height);

    context.font= this.xtick.getFont();
    context.fillStyle = this.xtick.font_color;
    context.textAlign = 'center'; 

    for(var i=0; i < this.xtick.val.length; i++){
      tk = this.xscale.convert(this.xtick.val[i]);
      startp.x = this.padding + tk;
      endp.x = this.padding + tk;
      lseg(context,startp,endp);
      context.fillText(this.xtick.get(i),
		       endp.x,endp.y+this.xtick.font_margin);
    } 
  };

  this.ytickdraw = function(){
    var context = this.canvas.getContext('2d');
    var startp = new canvas_point();
    var endp = new canvas_point();

    var tk;
    startp.set(this.padding,this.padding);
    endp.set(this.padding+this.width,this.padding);
 
    context.font= this.ytick.getFont();
    context.fillStyle = this.ytick.font_color;
    context.textBaseline = 'middle'; 
    for(var i=0; i < this.ytick.val.length; i++){
      tk = this.yscale.convert(this.ytick.val[i]);
      startp.y = this.padding +this.height- tk;
      endp.y = this.padding + this.height-tk;
      lseg(context,startp,endp);
      context.fillText(this.ytick.get(i),
		       startp.x-this.ytick.font_margin,startp.y);
    } 
  };
  
  function lseg(context,startp,endp,style){
    // 線分
    context.beginPath();
    context.moveTo(startp.x,startp.y);
    context.lineTo(endp.x,endp.y);
    if(style!=undefined){ context.strokeStyle = style;}
    context.stroke();
  }


  function string(context,str,point,size){
  }

  //////////////////////////////////////////////////////////
  // 折れ線グラフ
  this.line = function (data,style){
    if(!this.axes_draw){this.axes(data.xaxis,data.yaxis);}

    var context = this.canvas.getContext('2d');
    if(style!=undefined){ context.strokeStyle = style; }
    // 線を描く
    context.beginPath();
    for (var i = 0; i < data.xaxis.length; i++){
      
      var point = new canvas_point();
      point.x = this.padding + this.xscale.convert(data.xaxis[i]);
      point.y = this.padding + this.height-this.yscale.convert(data.yaxis[i]);
      if (i==0){
	context.moveTo(point.x,point.y);
      }else{
	context.lineTo(point.x,point.y);
      }
    }
    //現在のパスを輪郭表示する
    context.stroke();
    return this;
  };

  ///////////////////////////////////////////////////////////
  // ヒートマップ
  this.tone = function(data,style){
    var context = this.canvas.getContext('2d');    
    
    
    context.strokeStyle = 'rgb(00,00,00)'; //枠線の色
    context.lineWidth = 0.8;  // 線の太さ    
    
    
    var i,j;
    var canvas_size = 600;
    var margin = 50; // 描画するピクセル数%データ数=0になるように設定
    var delx = (canvas_size-margin*2)/data.xaxis.length;
    var dely = (canvas_size-margin*2)/data.yaxis.length;
//    var del = Math.min(delx,dely);
    
    for(j=0; j < data.yaxis.length; j++){
      for(i=0; i < data.xaxis.length; i++){
	// 塗りつぶしの色指定
	context.fillStyle = color_rgba(i*delx,j*dely,data.zaxis,0.8); 
	// 格子
	//         context.strokeRect(margin+delx*i,margin+dely*j,delx,dely); 
	// 格子の塗りつぶし
        context.fillRect(margin+delx*i,margin+dely*j,delx,dely); 
      }
    } 
    return this;

  };

  ///////////////////////////////////////////////////////////
  // 散布図
  this.scatter = function(data,color,size){
    if(!this.axes_draw){this.axes(data.xaxis,data.yaxis);}

    var context = this.canvas.getContext('2d');
    if(color!=undefined){ context.fillStyle = color; }
    if(color!=undefined){ context.fillStyle = color; }

    for (var i = 0; i < data.xaxis.length; i++){
      
      var point = new canvas_point();
      point.x = this.padding + this.xscale.convert(data.xaxis[i]);
      point.y = this.padding + this.height-this.yscale.convert(data.yaxis[i]);
      context.beginPath();
      context.arc(point.x, point.y, size, 0, Math.PI*2, false);
      context.stroke();
      context.fill();
    }
    //現在のパスを輪郭表示する
  };
  return this;
};


////////////////////////////////////////////////

function canvas_sample(){

  var data = new canvas_data();
  data.yaxis = [1,0.5,2,4];
  data.xaxis = [1,2,3,4];

  var graph = new canvas_graph('canvasline');
  graph.cbg = false;

//  graph.axes(data);
  graph.xrange.set(0,5);
  graph.yrange.set(0,5);
  
  graph.xtick.set([1,2,3,4])
    .setStr(["a","b","c","d"])
    .setFont(25,"px",'Times New Roman');
  // 線を引く
  graph.line(data,"rgba(255,0,0,1)")  
    .scatter(data,"rgba(255,0,0,1)",2);  
}


////////////////////////////////////////////////////
function color_rgba(r,g,b,a){
  return 'rgba('+r+','+g+','+b+','+a+')';
}

function print(str){
  console.log(str);
}
