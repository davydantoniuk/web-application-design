<?php
  if((isset($_POST["tresc"])) && isset($_POST["odp"]) && isset($_POST["odp_poprawna"])){
    $myFile = "pytania.json";
    copy("pytania.json", "pytania.json.backup");
    $json = file_get_contents($myFile);
    $json = json_decode($json, TRUE);
    array_push($json["pytania"], $_POST);
    var_dump($json);
    $json = json_encode($json);
    $fp = fopen($myFile, 'w') or die("Nie można otworzyć pliku");
    fwrite($fp, $json);
    fclose($fp);
}
?>
