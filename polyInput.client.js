  ///////// FUNCIONES GENERALES /////////
  function is_touch_device() {
    var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
    var mq = function(query){return window.matchMedia(query).matches};
    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch)return true;
    // include the 'heartz' as a way to have a non matching MQ to help terminate the join: https://git.io/vznFH
    var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
    return mq(query);
  }
  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - (min-1)) ) + min;
  }
  // DETECT IF LOCAL STORAGE IS AVAILABLE
  function storageAvailable(type) {
    var storage;
    try {
      storage = window[type];
      var x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    }
    catch(e) {
      return e instanceof DOMException && (
      // everything except Firefox
      e.code === 22 ||
      // Firefox
      e.code === 1014 ||
      // test name field too, because code might not be present
      // everything except Firefox
      e.name === 'QuotaExceededError' ||
      // Firefox
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      (storage && storage.length !== 0);
    }
  }
  function secHHMMSS(sec_num) {
    sec_num = parseInt(sec_num);
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
  }

  ///////// FUNCIONES CLIENTE /////////
  function vaciarDatos() {
    // Clear all items
    tiempo=1;
    tstart = Date.now();
    localStorage.clear();
    logData = [];
    // logData.push({"i":0,"tt":Date.now(),"t":0,"f":new Date().toISOString(),"p":0,"d":[]});
    logID = null;
    leerDatos();
    postLlevo = 0;
  }
  function leerDatos(){
    var d = [];
    if(poly!=null)d=poly.getDatos();
    document.querySelector('#consola').innerHTML = "Actual: "+JSON.stringify(d, null, "\t")+"\nLen: "+(logData.length)+"\nlogData: "+JSON.stringify(logData, null, "\t");
  }
  function guardaDatos(){
    postActualizado = false;
    logID=logData.length-(-1); // test
    var now = new Date().toISOString();
    logData.push({"i":logID,"tt":Date.now(),"t":(tiempo),"f":now,"p":getRndInteger(1,1000),"d":poly.datos}); // Rand test
    tiempo=1;
    // localStorage
    localStorage.setItem(logName,JSON.stringify(logData));
    leerDatos();
    // AJAX
    if(postLlevo==0) postDatos();
    postLlevo++;
    if(postLlevo>=postCada) postLlevo = 0;
  }
  function postDatos() {
    if(postActualizado){
      consolar("UPDATED","Datos están actualizados, no se guardan","#ff0");
    } else {
      postNum = logData.length;
      fetch('polyInput.server.php', {
        headers: {'Content-type': 'application/json'},
        method: 'POST',
        body: JSON.stringify({datos:logData}),
      }).then(res => res.json())
      .catch(error => logError(error))
      .then(response => postOK(response));
    }
  }
  function logError(error) {
    console.error('Error:', error);
    postLlevo=0;
  }
  function postOK(response) {
    if(response==undefined) {
      consolar("ERROR","No se recibió respuesta");
    } else {
      if (postNum>0 && postNum==logID)postActualizado = true;
      if(response.response==='NEW' || response.response==='UPDATE')
        var c='#0f0';
      else if(response.response==='OLD')
        var c='#ff0';
      else
        var c='#f00';
      consolar(response.response,response.data,c);
      // console.log('Success:', response);
    }
  }
  function loadLocalData() {
    // Clear all items
    // localStorage.clear();
    // Clear named item
    // localStorage.removeItem(logName);
    logData = JSON.parse(localStorage.getItem(logName));
    if(logData==null || logData.length<1) {
      vaciarDatos();
    }
    logID = logData.length;
  }
  function loadServerData() {
    fetch('polyInput.server.json')
      .catch(function(error) {
        consolar("ERROR","No se pudo cargar JSON de datos desde el servidor: "+error.message);
      })
      .then(function(response) {
        // console.log('response:',response);
        return response.json();
      })
      .then(function(json) {
        postNum = json.datos.length;
        if(logID==null)logID==0;
        if(logID<=0) { // No hay datos en LOCAL
          if(postNum>0){ // HAY DATOS en SERVER!!!!
            // Cargamos datos del servidor!!!
            logData = json.datos;
            logID = logData.length;
            localStorage.setItem(logName,JSON.stringify(logData));
            leerDatos();
            postActualizado = true;
          }
        } else if (postNum>0 && postNum==logID)postActualizado = true;
      });
      //////////////////////////////////////////////
      // FALTA CARGAR DATOS DE PREGUNTAS AL INICIO
      //////////////////////////////////////////////
  }
  function doTiempo() {
    tiempo++;
    if(logData.length>0)tstart = logData[0].tt-(logData[0].t*1000);
    // document.querySelector('#ttiempo').innerHTML=secHHMMSS((Date.now()-tstart)/1000);
    document.querySelector('#ttiempo').innerHTML=secHHMMSS((Date.now()-tstart)/1000);
    document.querySelector('#tiempo').innerHTML=secHHMMSS(tiempo);
  }

  // FUNCIONES DE ACCIÓN LLAMABLES
  function ayudar() { // Mostrar ayuda y pausar test
    timer.deactivate();
    clearInterval(tiempoInterval);
    document.querySelector('#modalAyuda').style.display='block';
    document.querySelector('body').style.overflow='hidden';
    postDatos(); // Actualiza los datos al punto actual al servidor
  }
  function pausar() { // Pausar test
    timer.deactivate();
    clearInterval(tiempoInterval);
    document.querySelector('#modalPausa').style.display='block';
    document.querySelector('body').style.overflow='hidden';
    postDatos(); // Actualiza los datos al punto actual al servidor
  }
  function playar() { // Reanudar test
    timer.activate();
    tiempoInterval = setInterval("doTiempo();",1000);
    document.querySelector('#modalAyuda').style.display='none';
    document.querySelector('#modalPausa').style.display='none';
    document.querySelector('body').style.overflow='auto';
  }

  var consolTime=null;
  function consolar(t='',m='',c='#ff0') {
    if(consolTime!=null)clearTimeout(consolTime);
    if(t=='' && m=='')document.querySelector('#consolaTit').innerHTML='';
    else {
      document.querySelector('#consolaTit').style.color=c;
      document.querySelector('#consolaTit').innerHTML = "<b>"+t+"</b>: "+m;
      consolTime = setTimeout("consolar();",6000);
    }
  }

  // FUNCIÓN DE INICIO
  function iniciar() {
    var d = null;
    // Deshabilitamos el botón
    document.querySelector('#btnSiguiente').classList.add("w3-disabled");
    // Intenta cargar datos actuales si los hay
    if(poly!=null){
      if(poly.datos.length!=sides)return;// Hay datos actuales? Si no, regresese muchacho
      guardaDatos(); // Cargar datos actuales
    }
    // Nueva pregunta
    window.scrollTo(0, 0);// Sube el scrill de la página
    sides = getRndInteger(2,9); // tiramos los dados tara el test
    poly = new polyInputKonva(sides,'#poly-container');
    leerDatos(); // Carga los datos preexistentes
    // Llenar los Datos
    pregunta.innerHTML=ipsum.sentence(4, 34, true);
    pregunta.style.fontSize=Math.round(poly.fontSize/2)+"px";
    for (var i = 0; i < 9; i++) {
      opciones[i].style.fontSize=Math.round(poly.fontSize/3)+"px";
      if(i<sides) {
        opciones[i].innerHTML=ipsum.sentence(1, 8);//' (R'+(i+1)+')';
        opciones[i].parentNode.style.display='list-item';
      } else {
        opciones[i].parentNode.style.display='none';
      }
    }
  }

  // Global variables
  var tiempo = 1;
  var postCada = 10;
  var logName = "datos";
  var postLlevo = 0;
  var postNum = 0;
  var tstart = null;
  var tiempoInterval = null;
  var sides = null;
  var postActualizado = false;
  var logData = null;
  var logID = null;
  var poly = null;

  var pregunta = document.querySelector('#pregunta');
  var opciones = [];
  for (var i = 0; i < 9; i++) opciones.push(document.querySelector('#opcion-'+i));

  // Log de resultados del test (se guarda en localstorage)
  if (storageAvailable('localStorage')) {
    // console.log("localStorage AVAILABLE");
    loadLocalData();
    loadServerData();
  } else {
    alert("localStorage NOT AVAILABLE");
  }

  // Test
  var ipsum = new LoremIpsum();

  // Listen to changed values
  document.querySelector('#poly-container').onclick = function (event) {
    leerDatos();
  };
  // Detect idle
  const timer = new IdleTimer(() => pausar(), 1000 * 60 * 1);

  document.querySelector('#btnPausa').onclick = function(event) {
    pausar();
  };
  document.querySelector('#btnAyuda').onclick = function(event) {
    ayudar();
  };

  // Siguiente pregunta:
  document.querySelector('#btnSiguiente').onclick = function(event) {
    iniciar();
  };

  window.onload = function(event) {

    // Random help text
    var p = '<p class="w3-padding-8"><b>'+ipsum.paragraph(3, 30)+'</b></p>';;
    var r = getRndInteger(1,15);
    for (var i = 0; i < r; i++) {
      p+='<p class="w3-padding-8">'+ipsum.paragraph(15, 100)+'</p>';
    }
    document.querySelector('#ayuda').innerHTML = p;


    // Load data
    if(logData.length>0)tstart = logData[0].tt-(logData[0].t*1000);
    else vaciarDatos();
    doTiempo();

    // if(is_touch_device())document.querySelector('#consola').style.display='none';

    // Detect idle
    timer.activate();
    tiempoInterval = setInterval("doTiempo();",1000);

    iniciar();
  }

  /*window.onresize = function(event) {
    poly = new polyInputKonva(sides,'#poly-container');
  };*/
