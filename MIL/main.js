var strona,dodaj_widoczne = false, pytania, poprawna_odp, runda, imie;
$(window).blur(function() {
  if(strona == "gra") {
    alert("W trakcje gry nie można opuszczać strony.\n Gra została zresegowana!");
    location.reload();
  }
});
$(document).ready( function() {
  console.log("jquery załadowane");
  gra();
  imie = document.cookie.substring(0, document.cookie.search(";"));
  $("#imie_input").attr("value", imie);
  $("#ranking_zawartosc").hide();
  $("#dodaj_form").hide();
  $("#dodaj_button").on("click", dodaj_form);
  $("#zapisz_button").on("click", zapisz);
  $("#graj_button").on("click", gra);
  $("#ranking_button").on("click", czytaj_ranking);
  $(".odp_button").each(function(index) {
    $(this).on("click", function() {sprawdz($(this))});
  });
  if(imie == "") {
    $("#imie_button").on("click", function() {
      imie = $("#imie_input").val();
      document.cookie = imie;
    });
  }
  else {
    $("#imie_div").hide();
    $(".wiersz_gra").show();
  }
});
function czytaj_ranking() {
  strona = "ranking";
  console.log("Funkcja ranking");
  $("#dodaj_form").hide();
  $("#gra").hide();
  $("#ranking_zawartosc").show();
  $.ajax({
    async: false,
    url: "ranking.json",
    dataType: "json",
    success: function(ranking) {
    for(i = 0; i < ranking["ranking"].length; i++)
      $("#ranking_zawartosc").append("<div class = 'ranking_wiersz'>" + ranking["ranking"][i].imie + " wygrał(a) "+ ranking["ranking"][i].kwota + "</div>");
    },
    error: function(err) {
      console.error(err.status);
    }
  });

}
function sprawdz(index) {
  console.log("Funkcja sprawdz");
  if($(index).html() == poprawna_odp) {
    $(index).css("background-color", "green");
    setTimeout(przydziel_pytanie, 500);
    $("#kwoty li:eq(" + (runda - 1) + ")").css("background-color", "green");
    $("#kwoty li:eq(" + (runda - 1) + ")").css("color", "#000096");
    $("#kwoty li:eq(" + (runda) + ")").css("background-color", "yellow");
    $("#kwoty li:eq(" + (runda) + ")").css("color", "black");
    if(runda == "13") {
      setTimeout(function(){
        $("#interfejs").empty();
        $("#interfejs").append("<h1>Koniec gry <br> Wygrałeś 1 000 000 zł</h1>");
        $("#interfejs").append("<button id = 'reset_button'>Zagraj jeszcze raz</button>");
        $(document).on("click", "#reset_button", function() {
          location.reload();
        });
    }, 500);
    }
    runda++;
  }
  else {
    strona = "koniec_gry";
    if(runda > 1){
      kwota = $("#kwoty li:eq(" + (runda - 2) + ")").html();
      kwota = kwota.substring(0, kwota.length-3);
    }
    else
      kwota = "0";
    json = {
      imie: imie,
      kwota: kwota
    };
    console.log(imie);
    console.log();
    $.ajax({
      url: "ranking.php",
      method: "post",
      data: json
    })
    .done(function(res) {console.log(res)})
    .fail(function(res) {console.log(res)});
    $(index).css("background-color", "red");
    $(".odp_button").each(function(index) {
      if($(this).html() == poprawna_odp){
        $(this).css("background", "green");
      }
    });
    setTimeout(function(){
      $("#interfejs").empty();
      if(runda != 1)
        $("#interfejs").append("<h1>Wygrałeś " + $("#kwoty li:eq(" + (runda - 2) + ")").html());
      else
        $("#interfejs").append("<h1>Nic nie wygrałeś. Spróbuj jeszcze raz</h1>");
      $("#interfejs").append("<button id = 'reset_button'>Zagraj jeszcze raz</button>");
      $(document).on("click", "#reset_button", function() {
        location.reload();
      });
  }, 500);
  }
}
function gra() {
  console.log("Funkcja gra");
  strona = "gra"
  $("#dodaj_form").hide();
  $(".wiersz_gra").show();
  $("#ranking_zawartosc").hide();
  $("#gra").show();
  runda = 1;
  pobierz_pytania();
  przydziel_pytanie();
  $("#kwoty li:eq(0)").css("background-color", "yellow");
  $("#kwoty li:eq(0)").css("color", "black");
}

function pobierz_pytania() {
  console.log("Funkcja pobierz_pytania");
  $.ajax({
    async: false,
    url: "pytania.json",
    dataType: "json",
    success: function(pyt) {
      pytania = pyt["pytania"];
      console.log(pyt["pytania"]);
    },
    error: function(err) {
      console.error(err.status);
    }
  });
}

function przydziel_pytanie() {
  console.log("Funkcja przydziel_pytanie");
  var nr_pytania = Math.floor(Math.random()*pytania.length + 1);
  $("#tresc_gra").html(pytania[nr_pytania].tresc);
  $(".odp_button").each(function(index) {
    $(this).html(pytania[nr_pytania].odp[index]);
  });
  $(".odp_button").css("background", "#23238E");
  poprawna_odp = pytania[nr_pytania].odp_poprawna;
  switch (poprawna_odp) {
    case 'A':
      poprawna_odp = pytania[nr_pytania].odp[0];
      break;
    case 'B':
      poprawna_odp = pytania[nr_pytania].odp[1];
      break;
    case 'C':
      poprawna_odp = pytania[nr_pytania].odp[2];
      break;
    case 'D':
      poprawna_odp = pytania[nr_pytania].odp[3];
      break;
  }
  pytania.splice(nr_pytania, nr_pytania);
}
function dodaj_form() {
  console.log("Funkcja dodaj_form");
  strona = "dodaj"
  $("#gra").hide();
  $("#dodaj_form").show();
  if(dodaj_widoczne == false) {
    dodaj_widoczne = true;

  }
  else {
    $("#zawartosc").empty();
    dodaj_widoczne = false;
  }
}

function zapisz() {
  console.log("Funkcja zapisz");
  $("#gra").hide();
  $("#dodaj_form").show();
  odp = $(".odp");
  if($("#odp_poprawna").val() == "---") alert("Która odpowiedź jest prawidłowa?");
  else {
    json = {
      tresc: $("#tresc").val(),
      odp: [$(odp[0]).val(), $(odp[1]).val(), $(odp[2]).val(), $(odp[3]).val()],
      odp_poprawna: $("#odp_poprawna").val()
    };
    $.ajax({
      url: "zapisz.php",
      method: "post",
      data: json
    })
    .done(function(res) {
      console.log(res);
      $("#tresc").val('');
      $(odp[0]).val('');
      $(odp[1]).val('');
      $(odp[2]).val('');
      $(odp[3]).val('');
    })
    .fail(function(res) {console.log("error"); console.log(res)});
  }
}
