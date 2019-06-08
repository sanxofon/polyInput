<?php
error_reporting(0);
@ini_set('display_errors', 0);
/*
  Recibe las RESPUESTAS en formato JSON desde el cliente.
  Si el test está completo responde que OK y 
  de lo contrario guarda el porcentaje de realización actual así como
  la fecha de inicio: Date.now()
*/

$x = rand(1,6);
sleep($x);
if ($x<=2) {
  http_response_code(404);
  echo "error 404";
  die();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['CONTENT_TYPE'] === 'application/json') {
$jsonfile = 'polyInput.server.json';
$jsonf = json_decode(file_get_contents($jsonfile),true); // JSON FILE
$json = json_decode(file_get_contents('php://input'),true); // JSON POST
$out = "Error recibiendo datos";
$status = "BAD";

// Si son la misma pila (checamos tiempo de inicio)
if ($json['datos'][0]['tt']>0) {// && @$json[0]['tt']==@$jsonf[0]['tt']) {
  $out = "Se recibió nueva versión";
  $status = "NEW";
  if($json['datos'][0]['tt']==@$jsonf['datos'][0]['tt']) {
    $out = "Se recibió versión anterior";
    $status = "OLD";
    if(count($json['datos'])>count($jsonf['datos'])) {
      $out = "Se recibió actualización";
      $status = "UPDATE";
    }
  }

  // Es más grande el nuevo que el anterior? (Así evitamos errores por asyncronia)
  if($status==='NEW' || $status==='UPDATE') {
    // Actualizamos el json
    file_put_contents('polyInput.server.json', json_encode($json, JSON_PRETTY_PRINT));

    // <<<<<<<<<<<
    // AQUI PODEMOS CHECAR SI YA SE TERMINÓ EL TEST!!
    // <<<<<<<<<<<

  }

}

$data = array(
  'response'=>$status,
  'data'=>$out,
);

header('Content-Type: application/json');
echo json_encode($data);

} else {
  die($_SERVER['REQUEST_METHOD']." : ".$_SERVER['CONTENT_TYPE']);
}