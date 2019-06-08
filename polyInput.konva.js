class polyInputKonva {

  constructor ( sides, containerSelector){
  /////////////////////////////////////////////////////
    this.sides = sides;
    var tis = this;
    // this.sides = 3; // CONFIG: número de vértices
    this.snap2grid = 1; //0=No, 1=Suave, 2=rudo
    var snapSteps = 3; //0=No, 0<Duplicaciones

    // Variables iniciales
    this.container = document.querySelector(containerSelector);
    // this.width = container.offsetWidth/2;
    // this.height = container.offsetHeight; //window.innerHeight;
    var fwidth = window.innerWidth;
    var fheight = window.innerHeight;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    var vertical = false;
    if(fwidth>768) {
      // this.height=this.height*0.8;
      if(this.height<4800)this.height=400;
      if(this.height>this.width/2.4)this.height=this.width/2.4;
      if(this.height>500)this.height=500;
      this.width=this.height-0;
    } else {
      vertical=true;
      this.width=this.width*0.92
      if(this.width>480)this.width=480;
      this.height=this.width-0;
    }
    if(this.sides==2)this.height=this.height/2;
    this.container.style.width=this.width;
    this.container.style.height=this.height;

    this.cx = this.width*(1/2); //Posición horizontal
    //Posición vertical y ajustes
    this.cy = this.height*(1/2);
    if(this.sides==3)this.cy=this.height*(1/1.65);
    else if(this.sides==5)this.cy=this.height*(1/1.85);
    else if(this.sides==7 || this.sides==9)this.cy=this.height*(1/1.96);

    this.polyRadius;
    var multiplo = 3;
    if(this.sides==2) {
      multiplo=1.3;
      if(vertical)multiplo=2.6;
    }
    else if(this.sides<=3)multiplo=2.4;
    else if(this.sides/2!=Math.floor(this.sides/2))multiplo=2.6;
    if (vertical) {
      this.polyRadius = this.width/multiplo;
    } else {
      this.polyRadius = this.height/multiplo;
    }
    this.vert2vert = 1.738*this.polyRadius;
    if(this.sides==2)this.vert2vert = 2*this.polyRadius;
    this.ballRadius = this.polyRadius/5;
    // if(this.sides==2)this.ballRadius = this.polyRadius/6;
    if(vertical)this.fontSize = fwidth/10;
    else this.fontSize = fwidth/12;
    if(this.fontSize<48)this.fontSize=48;
    else if(this.fontSize>68)this.fontSize=68;
    this.vertex = this.getVertices(this.cx, this.cy, this.polyRadius, this.sides);

    if(this.sides==3)this.puntos = this.getPuntos3(Array.from(this.vertex));//,<?php //echo abs(@$_GET['p'])>=0 ? abs(@$_GET['p']):0; ?>);
    else {
      this.puntos = this.getPuntos(Array.from(this.vertex),snapSteps);
      this.puntos.sort(function(a,b){return a[0]>b[0];});
      /*for (var i = 0; i < puntos.length; i++) {
        if(Math.round(this.cx)==Math.round(puntos[i][0]) && Math.round(this.cy)==Math.round(puntos[i][1])){
          console.log(puntos);
          console.log(puntos.splice(i,1));
          console.log(puntos);
          break;
        }
      }*/
    }

    // puntos.push([this.cx,this.cy]); // Punto central
    
    var mpos = {'x':this.cx,'y':this.cy};
    var vv = [];
    for (var i = 0; i < this.vertex.length; i++) {
      vv.push(this.vertex[i][0]);
      vv.push(this.vertex[i][1]);
    }

    // Construcción con konvajs [konvajs.org]
    this.stage = new Konva.Stage({
      container: containerSelector,
      width: this.width,
      height: this.height
    });

    this.layer = new Konva.Layer();

    var backGroup = new Konva.Group({
      x: 0,
      y: 0
    });

    var answerGroup = [];
    var answerCircle = [];
    var answerText = [];
    for (var i = 0; i < this.vertex.length; i++) {
      answerText[i] = new Konva.Text({
        x: 0,
        y: 0,
        fontSize: this.fontSize,
        fontFamily: 'Calibri',
        text: (i+1), // El texto a mostrar cerca del vértice actual
        fill: '#000',
        padding: 10
      });
      answerCircle[i] = new Konva.Circle({
        x: 0,
        y: 0,
        radius: this.ballRadius+10,
        fill: '#aaa',
        stroke: '#000',
        strokeWidth: 5,
      });
      answerGroup[i] = new Konva.Group({
        x: this.vertex[i][0],
        y: this.vertex[i][1]
      });
      answerText[i].attrs.x = -(answerText[i].width()/2);
      answerText[i].attrs.y = -(this.fontSize/1.7);
      answerGroup[i].add(answerCircle[i]);
      answerGroup[i].add(answerText[i]);
    }

    // Color de fondo
    /*var backColor = new Konva.Line({
      points: [0,0,this.width,0,this.width,this.height,0,this.height],
      fill: '#ff0',
      closed: true
    });
    backGroup.add(backColor);*/

    var setStroke = 5;
    if(this.sides==2) {
      var backPoly = new Konva.Line({
        points: [ vv[0],vv[1]-20, vv[2],vv[3]-20, vv[2],vv[3]+20, vv[0],vv[1]+20 ],
        fill: '#aaa',
        stroke: '#000',
        strokeWidth: setStroke,
        closed: true
      });
    } else {
      var backPoly = new Konva.Line({
        points: vv,
        fill: '#aaa',
        stroke: (this.sides==2?'#aaa':'#000'),
        strokeWidth: setStroke,
        closed: true
      });
     }
      backGroup.add(backPoly);
    
    // Agrega los textos de cada vertice al grupo de fondo
    for (var i = 0; i < this.sides; i++) {
      backGroup.add(answerGroup[i]);
    }

    this.ball = new Konva.Circle({
      x: this.cx,
      y: this.cy,
      radius: this.ballRadius,
      fill: '#f00',
      stroke: '#000',
      strokeWidth: 4,
      draggable: true,
      dragBoundFunc: function(pos) {
        if(tis.sides==2){
          var inside = tis.isInside2(tis.vertex,[pos.x,pos.y]);
          if(!inside){
            if(pos.x<tis.vertex[0][0])pos.x=tis.vertex[0][0];
            else if(pos.x>tis.vertex[1][0])pos.x=tis.vertex[1][0];
            inside=true;
          }
        } else {
          var inside = tis.isInside(tis.vertex,[pos.x,pos.y]);
        }
        if (!inside) {
          var nt = 1000;
          if(tis.sides==2) {
            var npos={'x':pos.x,'y':tis.vertex[0][1]};
            if(npos[0]==tis.vertex[0][0]) return false;
          }
          else var npos = {'x':pos.x,'y':pos.y};
          while(nt>0 && !tis.isInside(tis.vertex,[npos.x,npos.y])) {
            nt--;
            npos = tis.moveToPoint( [npos.x,npos.y], [tis.cx,tis.cy], 1 );
          }
          if(nt<0) return mpos;
          else return npos;
        } else {
          mpos = pos;
          return pos;
        }
      }
    });

    var centro = new Konva.Circle({
      x: tis.cx,
      y: tis.cy,
      radius: tis.ballRadius/10,
      fill: '#666',
    });

    // Dibujar puntos grid
    /*var puntosGroup = new Konva.Group({
      x: 0,
      y: 0
    });
    var puntosCircle = [];
    for (var i = 0; i < this.puntos.length; i++) {
      puntosCircle[i] = new Konva.Circle({
        x: this.puntos[i][0],
        y: this.puntos[i][1],
        radius: 5,
        fill: '#888',
      });
      puntosGroup.add(puntosCircle[i]);
    }*/

    // Snap to grid cuadros
    this.datos = [];
    this.datosum = 0;
    this.snapped = false;

    // Eventos----------------------
    // Evento escritorio
    backPoly.on('mouseup touchend', function() {
      var touchPos = tis.stage.getPointerPosition();
      tis.ball.x(touchPos.x);
      tis.ball.y(touchPos.y);
      tis.doSnap();
      tis.layer.draw(); // Redraw layer
      // tis.stage.batchDraw();
    });

    // Evento mixto (escritorio + mobile)
    for (var i = 0; i < this.sides; i++) {
      answerGroup[i].on('mousedown touchend', function(e) {
        if(tis.sides==2){
          // console.log(this.ball.x(),this.vertex[this.index-1][0]);
          tis.ball.x(tis.vertex[this.index-1][0]);
        }else{
          tis.ball.x(tis.vertex[this.index-1][0]);
          tis.ball.y(tis.vertex[this.index-1][1]);
        }
        tis.doSnap();
        tis.layer.draw(); // Redraw layer
        // tis.stage.batchDraw();
      });
      answerGroup[i].on('mouseenter', function() {
        tis.stage.container().style.cursor = 'pointer';
      });
      answerGroup[i].on('mouseleave', function() {
        tis.stage.container().style.cursor = 'default';
      });
    }

    this.ball.on('dragmove', (e) => {
      tis.ball.opacity(0.6);
      if(tis.snap2grid>1)tis.doSnap();
      else tis.doColor();
    });
    this.ball.on('dragend', (e) => {
      tis.ball.opacity(1.0);
      tis.doSnap();
    });

    // Cursor styles
    backPoly.on('mouseenter', function() {
      tis.stage.container().style.cursor = 'pointer';
    });
    backPoly.on('mouseleave', function() {
      tis.stage.container().style.cursor = 'default';
    });
    this.ball.on('mouseenter', function() {
      tis.stage.container().style.cursor = 'move';
    });
    this.ball.on('mouseleave', function() {
      tis.stage.container().style.cursor = 'default';
    });


    // add objects to layer
    this.layer.add(backGroup);

    // this.layer.add(puntosGroup);

    this.layer.add(centro);

    this.layer.add(this.ball);

    // add layer to stage
    this.stage.add(this.layer);

    // Initialize at load
    // this.doSnap();
    this.layer.draw(); // Redraw layer
    // this.stage.batchDraw();
  /////////////////////////////////////////////////////
  }

  // GETTERS
  getDatos() {
    return this.datos;
  }

  // Funciones
  getVertices(x, y, radius) {
    if(this.sides==2)return [[x-radius,y],[x-(-radius),y]];
    let tau = (Math.PI*2);
    let angle = tau / this.sides;
    let v = [];
    for (let a = 0; a < tau; a += angle) {
      let sx = x + Math.sin(a) * radius;
      let sy = y - Math.cos(a) * radius;
      v.push([sx, sy]);
    }
    return v;
  }

  getMidPoint(a,b) {
    return [a[0]+(b[0]-a[0])*0.50, a[1]+(b[1]-a[1])*0.50];
  }

  distA2B(a,b) {
    return Math.sqrt( ((a[0]-b[0])*(a[0]-b[0])) + ((a[1]-b[1])*(a[1]-b[1])) );
  }

  getPuntos3(v,n=0) {
    var mp = null;
    var dd = null;
    var ppp=[];
    for (var i = 0; i < v.length; i++) {
      ppp.push(v[i]);
    }
    for (var i = 0; i < v.length; i++) {
      for (var j = 0; j < v.length; j++) {
        if(i!=j) ppp.push(this.getMidPoint(v[i],v[j]));
      }
    }
    var pp=[];
    for (var i = 0; i < ppp.length; i++) {
      for (var j = 0; j < ppp.length; j++) {
        mp = this.getMidPoint(ppp[i],ppp[j]);
        dd = this.distA2B([this.cx,this.cy],mp);
        if(i!=j && dd>this.vert2vert/4) pp.push(this.getMidPoint(ppp[i],ppp[j]));
      }
    }
    var p=[];
    for (var i = 0; i < pp.length; i++) {
      p.push(pp[i]);
    }
    for (var i = 0; i < pp.length; i++) {
      for (var j = 0; j < pp.length; j++) {
        mp = this.getMidPoint(pp[i],pp[j]);
        dd = this.distA2B([this.cx,this.cy],mp);
        if(i!=j && dd>this.vert2vert/6) p.push(mp);
      }
    }
    for (var i = 0; i < v.length; i++) {
      p.push(v[i]);
    }
    return p;
  }

  getPuntos(v,n=1) { // n=nivel de recursividad 0 >= n >= 5
    n--;
    if(n<0)return v;
    var mp = null;
    var dd = null;
    var p=[];
    for (var i = 0; i < v.length; i++) {
      p.push(v[i]);
    }
    for (var i = 0; i < v.length; i++) {
      for (var j = i+1; j < v.length; j++) {
        mp = this.getMidPoint(v[i],v[j]);
        dd = this.distA2B([this.cx,this.cy],mp);
        if(this.sides==2 || dd>this.vert2vert/3.5) p.push(mp);
      }
    }
    if(n>0)return this.getPuntos(p,n);
    for (var i = 0; i < p.length; i++) {
      p[i]=p[i].join(",");
    }
    p = Array.from(new Set(p));
    for (var i = 0; i < p.length; i++) {
      p[i]=p[i].split(",");
      p[i][0]=parseFloat(p[i][0]);
      p[i][1]=parseFloat(p[i][1]);
    }
    // eliminar centro
    if(this.sides==2){
      var quita = null;
      for (var i = 0; i < p.length; i++) {
        if(Math.round(p[i][0])==Math.round(this.cx)) {
          quita = p.splice(i,1); //lo quita todas las veces que lo encuentra!!
        }
      }
    }
    return p;
  }

  isInside(v,pos) {
    const x=pos[0],y=pos[1];
    var inside = false;
    for (var i = 0, j = v.length - 1; i < v.length; j = i++) {
        var xi = v[i][0], yi = v[i][1];
        var xj = v[j][0], yj = v[j][1];
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
  }

  isInside2(v,pos) {
    var inside = false;
    if(pos[0]>v[0][0]-this.ballRadius && pos[0]<v[1][0]-(-this.ballRadius))inside=true
    /*console.log("v:",v);
    console.log("pos:",pos);
    console.log("inside:",inside);*/
    return inside;
  }

  moveToPoint(origen,destino,speed=1) {
    // Rotatar hacia destino
    var rotation = Math.atan2(destino[1] - origen[1], destino[0] - origen[0]);
    // Mover hacia destino (se sumar a posición actual)
    return { 'x':origen[0]+(Math.cos(rotation) * speed), 'y': origen[1]+(Math.sin(rotation) * speed) };
  }

  listSum(total, num) {
    return total + num;
  }

  doColor() {
    // Pinta de color la bola segunque tan cerca del centro esté
    var dc = this.distA2B([this.ball.x(),this.ball.y()],[this.cx,this.cy]); // Distancia al centro
    var cdc = Math.floor((dc*16)/this.polyRadius);
    var cdn = Math.floor(16-(cdc*3)); // El '3' es el índice de decrecimiento del rojo, si se disminuye se hace más gradual
    var d = null;
    if(cdn<0)cdn=0;
    if(cdn>15)cdn=15;
    if(cdc<0)cdc=0;
    if(cdc>15)cdc=15;
    var cdc2=cdc-1;
    if(cdc2<0)cdc2=0;
    cdc = cdc.toString(16);
    cdn = cdn.toString(16);
    cdc2 = cdc2.toString(16);
    this.ball.fill('#'+cdn+cdc2+cdc);
    for (var i = 0; i < this.vertex.length; i++) {
      d = this.distA2B([this.ball.x(),this.ball.y()],this.vertex[i]);
      if(d<0.27526*this.polyRadius) {
        this.ball.position({
          x: this.vertex[i][0],
          y: this.vertex[i][1]
        });
        break
      }
    }
    if(this.sides==2) {
      this.ball.y(this.vertex[0][1]);
    }
  }

  doSnap() {
    if(!this.snapped) {
      this.snapped=true;

      // Reemplazar con función interna a la clase
      document.querySelector('#btnSiguiente').classList.remove("w3-disabled");


    }
    var d = 0;

     //Snap 2 grid Switch
    if (this.snap2grid>0) {
      // GRID Triangular sin centro
      var checar = [-1,this.vert2vert*2];
      for (var i = 0; i < this.puntos.length; i++) {
        d = this.distA2B([this.ball.x(),this.ball.y()],this.puntos[i]);
        if(d<checar[1])checar=[i,d];
      }
      this.ball.position({
        x: this.puntos[checar[0]][0],
        y: this.puntos[checar[0]][1]
      });
    }

    // Distancia a los vertices: Datos a porcentaje
    var vd = [];
    for (var i = 0; i < this.sides; i++) {
      d = this.distA2B([this.ball.x(),this.ball.y()],this.vertex[i]);
      if(this.sides==2) {
        if(d>(2*this.polyRadius))d=(2*this.polyRadius);
        if(d<0.30*this.polyRadius)d=0;
      } else {
        if(d>(1.5*this.polyRadius))d=(1.5*this.polyRadius);
        if(d<0.27526*this.polyRadius)d=0;
      }
      vd.push(d);
    }

    // Dar color a la bola
    this.doColor();

    // opacity when on vertex
    this.ball.opacity(1.0);
    for (var i = 0; i < this.vertex.length; i++) {
      if(this.ball.x()==this.vertex[i][0] && this.ball.y()==this.vertex[i][1]) {
        this.ball.opacity(0.6);
        break;
      }
    }

    // Valores
    this.datos = []; // Vaciar Global
    for (var i = 0; i < vd.length; i++) {
      if(this.sides==2)d = (2*this.polyRadius)-vd[i];
      else d = (1.5*this.polyRadius)-vd[i];
      // if(d<0)d=0;
      this.datos.push(Math.round(d*100)/100);
    }
    var datosum2 = this.datos.reduce(this.listSum);
    // Porcentajes
    this.datosum = 0;
    for (var i = 0; i < this.datos.length; i++) {
      d = Math.round((100*this.datos[i])/datosum2);
      this.datosum+=d;
      if(this.datosum>100){
        this.datosum=100;
        this.datos[i] = d-1;
      } else this.datos[i] = d;
    }


    this.layer.draw(); // Redraw layer
    // this.stage.batchDraw();
  }

}