function canvas_sample(){
//描画コンテキストの取得
  var canvas = document.getElementById('canvassample');
  if(canvas.getContext){
    var context = canvas.getContext('2d');

    //左から20上から40の位置に、幅50高さ100の四角形を描く
    context.fillStyle = 'rgba(00,255,00,0.7)'; //塗りつぶしの色は赤
    context.fillRect(20,40,50,100); 

    //色を指定する
    context.strokeStyle = 'rgb(255,00,255)'; //枠線の色は青
    context.fillStyle = 'rgba(255,00,00,0.7)'; //塗りつぶしの色は赤

    //左から200上から80の位置に、幅100高さ50の四角の枠線を描く
    context.strokeRect(200,80,100,50); 

    //左から150上から75の位置に、半径60の半円を反時計回り（左回り）で描く
    context.arc(150,75,60,Math.PI*1,Math.PI*2,true);
    context.fill();
  }
}
function grid_generate(){
  canvas_grid(document.gridgen.imax.value,document.gridgen.jmax.value);
}

function canvas_grid(imax,jmax){
  var canvas = document.getElementById('canvas_grid');
  if(canvas.getContext){
    var context = canvas.getContext('2d');
    context.strokeStyle = 'rgb(00,00,00)'; //枠線の色
    context.lineWidth = 0.8;  // 線の太さ    


    var i,j;
    var canvas_size = 600;
    var margin = 50; // 描画するピクセル数%データ数=0になるように設定
    var delx = (canvas_size-margin*2)/imax;
    var dely = (canvas_size-margin*2)/jmax;
    var del = Math.min(delx,dely);

    for(j=0; j < jmax; j++){
      for(i=0; i < imax; i++){
	// 塗りつぶしの色指定
	context.fillStyle = color_rgba(i*delx,j*dely,i*j,0.8); 
	// 格子
//         context.strokeRect(margin+delx*i,margin+dely*j,delx,dely); 
	// 格子の塗りつぶし
        context.fillRect(margin+delx*i,margin+dely*j,delx,dely); 
      }
    }
  }
}

function color_rgba(r,g,b,a){
  return 'rgba('+r+','+g+','+b+','+a+')';
}
