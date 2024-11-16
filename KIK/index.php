<html>
<head>
  <title>Kółko i krzyżyk</title>
</head>
<style>
  body {
    max-width: 550px;
  }
  .tile-container {
    width: 180px;
    overflow: inherit;
  }
  .tile {
    height: 50px;
    width: 50px;
    margin: 5px;
    float: left;
    background-color: #80dec5;
  }
  .x-mark {
    background: #FFF url("image/icon-x.png");
  }
  .o-mark {
    background: #FFF url("image/icon-o.png");
  }
  div#game-result {
    clear: both;
    margin-top: 20px;
    padding: 10px;
    display: none;
    background: none;
  }
  div#game-result.win {
    background: #7fdec5;
  }
  div#game-result.lost {
    background: #ffc433;
  }
  div#game-result.draw {
    background: #f0f0f0;
  }
  .reset {
    cursor: pointer;
    text-decoration: underline;
  }
</style>
<body>
  <script type="text/javascript" src="jquery/jquery-3.2.1.min.js"></script>
  <div class="tile-container">
    <div class="tile" id="tile-1" data-position="1"></div>
    <div class="tile" id="tile-2" data-position="2"></div>
    <div class="tile" id="tile-3" data-position="3"></div>
    <div class="tile" id="tile-4" data-position="4"></div>
    <div class="tile" id="tile-5" data-position="5"></div>
    <div class="tile" id="tile-6" data-position="6"></div>
    <div class="tile" id="tile-7" data-position="7"></div>
    <div class="tile" id="tile-8" data-position="8"></div>
    <div class="tile" id="tile-9" data-position="9"></div>
  </div>
  <div id="game-result"></div>
  <script>
    function computerTurn() {
      var choose = $(".tile:not(.marked)");
      randChoice = choose[Math.floor(Math.random() * choose.length)];
      $(randChoice).addClass('marked');
      $(randChoice).addClass('o-mark');
      trackTicTac(randChoice, 'o-mark');
    }

    function resetTicTacToe() {
      $(".tile").removeClass("marked");
      $(".tile").removeClass("o-mark");
      $(".tile").removeClass("x-mark");
      $("#game-result").hide();
      $("#game-result").html("");
      $("#game-result").removeClass("win");
      $("#game-result").removeClass("lost");
      $("#game-result").removeClass("draw");
      finished = false;
    }

    function checkDraw() {
      var markedTiles = $(".tile.marked").length;
      if (markedTiles === 9 && !finished) {
        finished = true;
        $("#game-result").show();
        $("#game-result").html("Koniec gry. Remis!" +
          " <span class='reset' onclick='resetTicTacToe();'>Kliknij i zagraj jeszcze raz</span>.");
        $("#game-result").addClass("draw");
      }
    }

    function trackTicTac(obj, mark) {
      var winning_probability = [
        [1, 2, 3], [1, 4, 7], [1, 5, 9], [2, 5, 8], [3, 5, 7],
        [3, 6, 9], [4, 5, 6], [7, 8, 9]
      ];
      var markedPosition = $(obj).data("position");
      $.each(winning_probability, function(key, winning_probability_index) {
        if ($.inArray(markedPosition, winning_probability_index) >= 0) {
          markedLength = 0;

          $.each(winning_probability_index, function(index, value) {
            var innerSquareClass = $("#tile-" + value).attr("class");

            if (innerSquareClass.indexOf(mark) > 0) {
              markedLength = markedLength + 1;

              if (markedLength == winning_probability_index.length) {
                finished = true;
                if (mark == "x-mark") {
                  status = " Wygrałeś!";
                  className = "win";
                } else {
                  status = " Przegrałeś!";
                  className = "lost";
                }

                $("#game-result").show();
                $("#game-result").html("Koniec gry." + status +
                  " <span class='reset' onclick='resetTicTacToe();'>Kliknij i zagraj jeszcze raz</span>.");
                $("#game-result").addClass(className);
              }
            }
          });
        }
      });
      return finished;
    }

    $(document).ready(function() {
      finished = false;
      $(".tile").on('click', function() {
        if (!finished) {
          var squareClass = $(this).attr("class");
          if (squareClass.indexOf("marked") < 0) {
            $(this).addClass('marked');
            $(this).addClass('x-mark');
            finished = trackTicTac(this, 'x-mark');
            checkDraw();

            if (!finished) {
              computerTurn();
              checkDraw();
            }
          }
        }
      });
    });
  </script>
</body>
</html>