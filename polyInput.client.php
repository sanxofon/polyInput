<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <!-- <meta name="viewport" content="width=device-width, initial-scale=1"> -->
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="MentalCORE">
    <meta name="author" content="Santiago Chávez">
    <meta name="generator" content="MentalCORE">
    <title>MentalCORE</title>

    <link rel="canonical" href="https://localhost/">

    <link rel="stylesheet" href="w3.css"> 
    <link rel="stylesheet" href="font-awesome.min.css">
    <link rel="stylesheet" href="polyInput.client.css">
    <!-- DEPENDENCIAS -->
    <script src="konva.min.js"></script>
    <script src="idletimer.js"></script>
    <!-- TEST ONLY -->>
    <script src="loremIpsum.js"></script>

  </head>
  <body>

    <div id="modalAyuda" class="w3-modal">
      <div class="w3-modal-content w3-display-middle">


        <div class="w3-bar w3-dark-gray">
          <span class="w3-bar-item w3-xxlarge">
            &nbsp; <i class="fa fa-question-circle"></i> <b>Ayuda</b> &nbsp;  
          </span>
          <span onclick="playar()" class="w3-bar-item w3-right w3-button w3-dark-gray w3-xxlarge"><i class="fa fa-window-close w3-xxlarge"></i></span>
        </div>

        <div class="w3-scroller">
          <div class="w3-panel w3-large" id="ayuda"></div>
        </div>

      </div>
    </div>

    <div id="modalPausa" class="w3-modal">
      <div class="w3-modal-content w3-display-middle">
        <div onclick="playar()" class="w3-display-middle w3-large w3-button w3-round b-cyan w3-shadow" style="box-shadow: 0 0 2em #000;">
          <i class="fa fa-play w3-text-black" style="font-size: 20vh;line-height: 100%;"></i>
          <br>
          <b>continuar&nbsp;evaluación</b>
        </div>
        
      </div>
    </div>

    <header class="w3-top">
      <div class="w3-bar maxwidth">
        <div class="w3-bar-item" href="#" style="margin-top: 0px;font-size: 2rem;"><t class="c-gray">Mental</t><b class="c-red">CORE</b></div>
        <div class="w3-bar-item w3-right" style="margin-top: 8px;">
          <a class="w3-button w3-dark-gray w3-border w3-border-black w3-round w3-text-light-gray w3-large pad-button" id="btnAyuda"><i class="fa fa-question-circle w3-xxlarge"></i></a>
          <a class="w3-button w3-cyan w3-border w3-border-black w3-round w3-large pad-button" id="btnPausa"><i class="fa fa-pause w3-xxlarge"></i></a></div>
      </div>
    </header>
    <div style="height: 70px;">&nbsp;</div>
    <div class="maxwidth">
      <div class="full-container pad-4 ">

        <div class="w3-container">
          <h1 class="pad-16" id="pregunta"></h1>
        </div>
        <div class="w3-row">
          <div class="w3-container w3-half">
            <hr>
            <div class="w3-container" style="border-bottom: 1px solid #444;box-shadow: inset 0 -2rem 5rem rgba(60, 60, 60, .5);padding-bottom: 30px;">
              <p class="w3-xlarge c-dgray">Opciones:</p>
              <ol class="w3-xlarge">
<?php for ($i=0; $i < 9; $i++) { ?>
                <li class="c-cyan" style="font-size: 1.2em; line-height: 100%; margin-top: 20px; display: none;"><div class="c-white" id="opcion-<?=$i?>"></div></li>
<?php } ?>

              </ol>
            </div>
          </div>
          <div class="w3-half">
            <div id="poly-container"></div>
          </div>
        </div>

        <div class="w3-center w3-xlarge pad-24">
          <a id="btnSiguiente" class="w3-button w3-green w3-round w3-disabled"> &nbsp;<b>&gt; SIGUIENTE &gt;</b>&nbsp; </a>
        </div>

      </div>
    </div>

    <footer class="w3-container pad-24 w3-center">
      <p>&copy; <b>Núcleo Cero S.C.</b> (2017-<?php echo date("Y"); ?>)</p>
    </footer>

    <div class="w3-display-bottomleft" style="position: fixed;z-index: 99999;"><span id="ttiempo" class="w3-button w3-small w3-black" onclick="vaciarDatos();" title="Vaciar datos"></span> <span id="tiempo" class="w3-button w3-small w3-black" onclick="tiempo=1;" title="Reiniciar tiempo de la pregunta"></span> <span class="w3-button w3-small w3-dark-gray" onclick="document.querySelector('#consola').classList.toggle('consola-expandida');this.firstChild.classList.toggle('fa-plus-square');this.firstChild.classList.toggle('fa-minus-square');"><i class="fa fa-plus-square"></i></span><span id="consolaTit"></span></div>
    <div class="w3-container w3-bottom w3-text-green" id="consola"></div>

<script src="polyInput.client.js"></script>
<script src="polyInput.konva.js"></script>
</body>
</html>
