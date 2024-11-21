<?php
  if((isset($_POST["imie"])) && (isset($_POST["kwota"]))){
    $myFile = "ranking.json";
    $json = file_get_contents($myFile);
    $json = json_decode($json, TRUE);
    console.log($json);
    array_push($json["ranking"], $_POST);
    $kwota = array();
    foreach($json["ranking"] as $key => $row) {
      $kwota[$key] = $row["kwota"];
    }
    array_multisort($kwota, SORT_DESC, $json["ranking"]);
    $json = json_encode($json);
    print_r($json);
    $fp = fopen($myFile, 'w') or die("Nie można otworzyć pliku");
    fwrite($fp, $json);
    fclose($fp);
}

?>
