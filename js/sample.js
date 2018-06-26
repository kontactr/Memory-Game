var animationEnd = (function(el) {
  console.log(el);
  var animations = {
    animation: "animationend",
    OAnimation: "oAnimationEnd",
    MozAnimation: "mozAnimationEnd",
    WebkitAnimation: "webkitAnimationEnd"
  };

  for (var t in animations) {
    if (el.style[t] !== undefined) {
      return animations[t];
    }
  }
})(document.createElement("div"));

var icons = [];

var cards = [];

var two_cards_track = [];

var flag = false;

var counter = 0;

var readyToInput = true;

var minutes = 0;

var seconds = 0;

var moves = 0;

var startTimerCount = true;

var intervalVar = null;

var open_cards_track = [];

var local_storage_objects = [];

$(function() {
  /* parentElement.addClass('animated zoomIn')
        parentElement.on(animationEnd , function(e){
          parentElement.removeClass('animated zoomIn')
//          console.log("gellpo world")
        }); */
  let timerDisplay = $("#timer-data");
  let movesDisplay = $("#moves-data");

  let starOne = $("#star-one");
  let starTwo = $("#star-two");
  let starThree = $("#star-three");
  let resetButton = $("#reset-button");
  console.log(movesDisplay, starOne, starTwo, starThree, resetButton);
  let formatedTimeSeconds = "00";
  let formatedTimeMinutes = "00";
  let scoreGetsToZeroInterval = null;

  function getRandomIcons() {
    let icons = [];

    switch (Math.floor(Math.random() * 10 % 5)) {
      case 0:
        icons = [
          "google",
          "meetup",
          "evernote",
          "pocket",
          "dropbox",
          "twitter",
          "youtube",
          "yahoo"
        ];
        break;

      case 1:
        icons = [
          "acrobat",
          "amazon",
          "android",
          "bitbucket",
          "bitcoin",
          "appstore",
          "wikipedia",
          "dribbble"
        ];
        break;
      case 2:
        icons = [
          "googleplus",
          "pinterest",
          "windows",
          "yelp",
          "spotify",
          "skype",
          "macstore",
          "instagram"
        ];
        break;
      case 3:
        icons = [
          "cal",
          "call",
          "cart",
          "guest",
          "print",
          "pinboard",
          "podcast",
          "email"
        ];
        break;
      case 4:
        icons = [
          "quora",
          "reddit",
          "googleplay",
          "tumblr",
          "steam",
          "flickr",
          "stumbleupon",
          "weibo"
        ];
        break;
    }

    return icons;
  }

  icons = getRandomIcons();
  console.log(icons);

  function readStorageObjects() {
    let local_storage_objects = [];
    if (window.localStorage) {
      for (let index = 0; index < 6; index++) {
        let objectValue = window.localStorage.getItem("object-" + index);
        if (objectValue !== null) {
          local_storage_objects.push(JSON.parse(objectValue));
        }
      }
    }
    return local_storage_objects;
  }

  local_storage_objects = readStorageObjects();

  function sortObjects(storage_objects) {
    let counter = storage_objects.length;
    for (let index = 0; index < storage_objects.length; index++) {
      for (let innerIndex = 0; innerIndex < counter - 1; innerIndex++) {
        let firstObject = storage_objects[innerIndex];
        let secondObject = storage_objects[innerIndex + 1];

        if (firstObject.moves > secondObject.moves) {
          let tempObject = firstObject;
          storage_objects[innerIndex] = secondObject;
          storage_objects[innerIndex + 1] = tempObject;
        }
      }
      counter -= 1;
    }

    return storage_objects;
  }

  function insertObjects(storage_objects, newObject) {
    let index = 0;
    let flag = false;
    for (index = 0; index < storage_objects.length; index++) {
      if (storage_objects[index].moves > newObject.moves) {
        flag = true;
        break;
      } else if (storage_objects[index].moves === newObject.moves) {
        if (storage_objects[index].minute > newObject.minute) {
          flag = true;
          break;
        } else if (storage_objects[index].minute === newObject.minute) {
          if (storage_objects[index].second >= newObject.second) {
            flag = true;
            break;
          }
        }
      }
    }

    if (storage_objects.length < 6) {
      storage_objects.splice(index, 0, newObject);
    } else {
      if (flag) {
        storage_objects.splice(index, 0, newObject);
        storage_objects.pop();
      }
    }

    return storage_objects;
  }

  function storeObjectsLocalStorage(storage_objects) {
    for (let index = 0; index < storage_objects.length; index++) {
      window.localStorage.setItem(
        "object-" + index,
        JSON.stringify(storage_objects[index])
      );
    }
  }

  function scoreGetsToZero() {
    if (moves > 0) movesDisplay.text(moves--);
    else {
      movesDisplay.text(moves);
      clearInterval(scoreGetsToZeroInterval);
      moves = 0;
    }
  }

  resetButton.on("click", function(e) {
    e.stopPropagation();
    resetGame(e);
  });

  function resetGame(e) {
    e.stopPropagation();
    readyToInput = false;
    two_cards_track = [];
    flag = false;
    counter = 0;
    minutes = 0;
    seconds = 0;
    moves = 0;
    cards = [];
    //scoreGetsToZeroInterval = setInterval(scoreGetsToZero , 1);
    movesDisplay.text(moves);

    console.log(cards);

    startTimerCount = true;

    console.log("stop reset game");

    clearInterval(intervalVar);
    timerDisplay.text("00 : 00");

    starOne.css("visibility", "visible");
    starOne.removeClass("fadeOut animated");
    starTwo.css("visibility", "visible");
    starTwo.removeClass("fadeOut animated");
    starThree.css("visibility", "visible");
    starThree.removeClass("fadeOut animated");
    movesDisplay.text(moves);
    resetButton.removeClass("fontawesome-undo");
    resetButton.addClass("fontawesome-spinner");

    $("#container-cards").css("class", "");
    $("#container").css("animation", "");
    $("#container").css("transition", "");
    $("#container").css("background", "linear-gradient(#02ccba, #aa7ecd)");

    for (let index = 0; index < open_cards_track.length; index++) {
      let first_remove_li = $(open_cards_track[index]).children(".class-li");
      let first_remove_i = $(open_cards_track[index]).children(".class-i");

      $(first_remove_li).css("animation", "rotate-zero 0.2s forwards");

      $(first_remove_i).css("animation", "rotate-oeg-fi 0.01s forwards");

      // cards[$(open_cards_track[index]).children('.class-i').attr('data-no')].state = true;
    }

    //childelement.attr('data-prev-class' , 'zocial-' + icons[cards[childelement.attr('data-no')].no - 1] );

    icons = getRandomIcons();
    console.log(icons);

    if (open_cards_track.length >= 1) {
      let lastElement = $(
        open_cards_track[open_cards_track.length - 1]
      ).children(".class-i");

      lastElement.on(animationEnd, function(e) {
        e.stopPropagation();

        lastElement.on(animationEnd, undefined);

        let array1 = shuffle([0, 1, 2, 3, 4, 5, 6, 7]);
        let array2 = shuffle([0, 1, 2, 3, 4, 5, 6, 7]);
        for (let index = 0; index < 16; index++) {
          let parent = $("#card-" + index);
          let parentChildP = parent.children(".class-i");
          let childPrevClass = parentChildP.attr("data-prev-class");
          parentChildP.removeClass(childPrevClass);

          if (index < 8) {
            cards.push({
              no: array1[index] + 1,
              state: true
            });
          } else {
            cards.push({
              no: array2[index % 8] + 1,
              state: true
            });
          }

          parentChildP.addClass(
            "zocial-" + icons[cards[parentChildP.attr("data-no")].no - 1]
          );
          parentChildP.attr(
            "data-prev-class",
            "zocial-" + icons[cards[parentChildP.attr("data-no")].no - 1]
          );
        }
      });
    } else {
      let array1 = shuffle([0, 1, 2, 3, 4, 5, 6, 7]);
      let array2 = shuffle([0, 1, 2, 3, 4, 5, 6, 7]);
      for (let index = 0; index < 16; index++) {
        let parent = $("#card-" + index);
        let parentChildP = parent.children(".class-i");
        let childPrevClass = parentChildP.attr("data-prev-class");
        parentChildP.removeClass(childPrevClass);

        if (index < 8) {
          cards.push({
            no: array1[index] + 1,
            state: true
          });
        } else {
          cards.push({
            no: array2[index % 8] + 1,
            state: true
          });
        }

        parentChildP.addClass(
          "zocial-" + icons[cards[parentChildP.attr("data-no")].no - 1]
        );
        parentChildP.attr(
          "data-prev-class",
          "zocial-" + icons[cards[parentChildP.attr("data-no")].no - 1]
        );
      }
    }

    open_cards_track = [];
    resetButton.removeClass("fontawesome-spinner");
    resetButton.addClass("fontawesome-undo");

    $("#trophy-icon").css("opacity", "0");

    $("#trophy-icon").removeClass("fontawesome-trophy");
    $("#trophy-icon").css("cursor", "default");
    $("#trophy-icon").attr("title", "scoreboard is locked");
    $("#trophy-icon").unbind("click");

    readyToInput = true;
  }

  function timer() {
    seconds += 1;

    if (seconds === 60) {
      minutes += 1;
      seconds = 0;
    }

    if (seconds < 10) {
      formatedTimeSeconds = "0" + seconds;
    } else {
      formatedTimeSeconds = "" + seconds;
    }

    if (minutes < 10) {
      formatedTimeMinutes = "0" + minutes;
    } else {
      formatedTimeMinutes = "" + minutes;
    }

    timerDisplay.text(formatedTimeMinutes + " : " + formatedTimeSeconds);
  }

  /* StackOverflow  https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array */
  function shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  $("#score-header").css("visibility", "hidden");
  $("#main-game-container").css("visibility", "hidden");
  $("#game-header").addClass("animated pulse");
  $("#game-header").on(animationEnd, function(e) {
    e.stopPropagation();
    $(this).removeClass("animated pulse");
  });

  $("#start-button").on("click", function(e) {
    e.stopPropagation();
    $("#main-game-container").css("visibility", "visible");
    $("#zIndexStarter").css("z-index", "-1");
    $("#zIndexContainer").css("z-index", "1");
    $("#zIndexEnd").css("z-index", "0");

    $(".card").addClass("animated zoomIn");
    $(".card").on(animationEnd, function(e) {
      e.stopPropagation();
      $(this).removeClass("animated zoomIn");
    });
  });

  let ulElement = $("#container-cards");
  let array1 = shuffle([0, 1, 2, 3, 4, 5, 6, 7]);
  let array2 = shuffle([0, 1, 2, 3, 4, 5, 6, 7]);

  for (let i = 0; i < 16; i++) {
    let parentElement = $('<div class="card" id="card-' + i + '" ></div>');
    let element = $('<li class="class-li" id="" ></li>');
    let childelement = $('<p class="class-i" data-no="' + i + '"></p>');
    parentElement.append(element);
    parentElement.append(childelement);

    ulElement.append(parentElement);
    if (i < 8) {
      cards.push({
        no: array1[i] + 1,
        state: true
      });
    } else {
      cards.push({
        no: array2[i % 8] + 1,
        state: true
      });
    }
    childelement.addClass(
      "zocial-" + icons[cards[childelement.attr("data-no")].no - 1]
    );
    childelement.attr(
      "data-prev-class",
      "zocial-" + icons[cards[childelement.attr("data-no")].no - 1]
    );
    parentElement.on("click", function(e) {
      console.log("five times called by noew");

      e.stopPropagation();
      if (startTimerCount) {
        intervalVar = setInterval(timer, 1000);
        startTimerCount = false;
      }

      if (
        readyToInput &&
        cards[$(this).children(".class-i").attr("data-no")].state
      ) {
        movesDisplay.text(++moves);

        if (moves === 30) {
          starThree.addClass("animated fadeOut");
          starThree.one(animationEnd, function(e) {
            e.stopPropagation();
            $(this).css("visibility", "hidden");
            $(this).removeClass("animated fadeout");
          });
        } else if (moves === 45) {
          starTwo.addClass("animated fadeOut");
          starTwo.one(animationEnd, function(e) {
            e.stopPropagation();
            $(this).css("visibility", "hidden");
            $(this).removeClass("animated fadeout");
          });
        } else if (moves === 60) {
          starOne.addClass("animated fadeOut");
          starOne.one(animationEnd, function(e) {
            e.stopPropagation();
            $(this).css("visibility", "hidden");
            $(this).removeClass("animated fadeout");
          });
        }

        if (two_cards_track.length < 1) {
          cards[$(this).children(".class-i").attr("data-no")].state = false;

          two_cards_track.push(this);

          open_cards_track.push(this);

          $(this)
            .children(".class-li")
            .css("animation", "rotate-oeg 1s forwards");

          $(this)
            .children(".class-i")
            .css("animation", "rotate-tsix 1s forwards");

          // $(this).children(".class-i").animateCss('rotate-tsix')
        } else if (two_cards_track.length == 1) {
          cards[$(this).children(".class-i").attr("data-no")].state = false;

          two_cards_track.push(this);

          open_cards_track.push(this);

          readyToInput = false;

          $(this)
            .children(".class-li")
            .css("animation", "rotate-oeg 0.7s forwards");

          $(this)
            .children(".class-i")
            .css("animation", "rotate-tsix 0.7s forwards");
          $(this).children(".class-i").one(animationEnd, function(e) {
            e.stopPropagation();
            if (two_cards_track.length == 2) {
              //console.log(two_cards_track, 'werg');
              //       console.log("pass-2")
              let first = two_cards_track[0];
              let second = two_cards_track[1];

              if (
                cards[$(first).children(".class-i").attr("data-no")].no ===
                cards[$(second).children(".class-i").attr("data-no")].no
              ) {
                counter += 2;
                cards[
                  $(first).children(".class-i").attr("data-no")
                ].state = false;
                cards[
                  $(second).children(".class-i").attr("data-no")
                ].state = false;
                readyToInput = true;
                two_cards_track.pop();
                two_cards_track.pop();
              } else {
                //      console.log("pass-2 phase 1")
                let first_li = $(first).children(".class-li");
                let first_i = $(first).children(".class-i");
                let second_li = $(second).children(".class-li");
                let second_i = $(second).children(".class-i");

                $(first_li).css("animation", "rotate-zero 0.5s forwards");
                $(first_i).css("animation", "rotate-oeg-fi 0.5s forwards");

                $(second_li).css("animation", "rotate-zero 0.5s forwards");

                $(second_i).css("animation", "rotate-oeg-fi 0.5s forwards");

                two_cards_track.pop();
                two_cards_track.pop();

                open_cards_track.pop();
                open_cards_track.pop();
                readyToInput = true;

                cards[
                  $(first).children(".class-i").attr("data-no")
                ].state = true;
                cards[
                  $(second).children(".class-i").attr("data-no")
                ].state = true;
              }

              if (/*  moves === 2  */ counter === 16) {
                clearInterval(intervalVar);

                $("#reset-button").removeClass("fontawesome-undo");
                $("#reset-button").addClass("fontawesome-spinner");
                $("#reset-button").css("cursor", "default");

                $("#container").css(
                  "animation",
                  "background-color-transition 2s forwards"
                );
                $("#container").one(animationEnd, function(e) {
                  e.stopPropagation();
                  $(this).css("animation", "");

                  $("#container-cards").addClass("animated shake");

                  console.log("hello world above there");
                  var target = e.target || e.srcElement;
                  console.log(target);

                  $("#container-cards").one(animationEnd, function(e) {
                    e.stopPropagation();
                    target = e.target || e.srcElement;
                    console.log(target);

                    $(this).removeClass("animated shake");
                    console.log("hello world only here");

                    if (window.localStorage) {
                      let timerData =
                        formatedTimeMinutes + " : " + formatedTimeSeconds;
                      let movesData = moves;
                      let starsData = 3;
                      if (moves >= 60) {
                        starsData = 0;
                      } else if (moves >= 45) {
                        starsData = 1;
                      } else if (moves >= 30) {
                        starsData = 2;
                      } else if (moves >= 0) {
                        starsData = 3;
                      } else {
                        starsData = 0;
                      }

                      let objectOfResult = {
                        time: timerData,
                        moves: movesData,
                        stars: starsData,
                        minute: minutes,
                        second: seconds
                      };

                      local_storage_objects = sortObjects(
                        local_storage_objects
                      );
                      local_storage_objects = insertObjects(
                        local_storage_objects,
                        objectOfResult
                      );
                      storeObjectsLocalStorage(local_storage_objects);

                      local_storage_objects = readStorageObjects();
                      //console.log(local_storage_objects , objectOfResult);

                      for (
                        let index = 0;
                        index < local_storage_objects.length;
                        index++
                      ) {
                        let elementRank = $("#sc-rank-" + (index + 1));
                        let elementTime = $("#sc-time-" + (index + 1));
                        let elementMoves = $("#sc-moves-" + (index + 1));
                        let elementStars = $("#sc-stars-" + (index + 1));

                        elementRank.text("#" + (index + 1));
                        elementTime.text(local_storage_objects[index].time);
                        elementMoves.text(local_storage_objects[index].moves);

                        let elementStarsChildren = $(elementStars).children();
                        for (
                          let index_new = 0;
                          index_new < local_storage_objects[index].stars;
                          index_new++
                        ) {
                          $(elementStarsChildren[index_new]).addClass(
                            "fontawesome-star"
                          );
                        }
                      }
                    }

                    $("#trophy-icon").addClass("fontawesome-trophy");
                    $("#trophy-icon").css("opacity", "1");
                    $("#trophy-icon").css("cursor", "pointer");
                    $("#trophy-icon").attr(
                      "title",
                      "Winner Winner ... Scoreboard"
                    );
                    $("#trophy-icon").addClass("animated flash");
                    $("#trophy-icon").one(animationEnd, function(e) {
                      e.stopPropagation();
                      $(this).removeClass("animated flash");
                      $(this).addClass("animated flipInX");
                      $(this).on(animationEnd, function(e) {
                        e.stopPropagation();
                        $(this).removeClass("animated flipInX");
                        $("#reset-button").removeClass("fontawesome-spinner");
                        $("#reset-button").addClass("fontawesome-undo");
                        $("#reset-button").css("cursor", "pointer");
                      });
                    });

                    $("#trophy-icon").one("click", function(e) {
                      e.stopPropagation();
                      $("#score-header").css("visibility", "visible");
                      $("#zIndexStarter").css("z-index", "0");
                      $("#zIndexContainer").css("z-index", "-1");
                      $("#zIndexEnd").css("z-index", "1");
                      $("#main-game-container").css("visibility", "hidden");
                      $("#game-header").css("visibility", "hidden");
                      $(".score-cards").addClass("animated fadeIn");
                      $(".score-cards").on(animationEnd, function(e) {
                        e.stopPropagation();
                        $(this).removeClass("animated fadeIn");
                      });
                    });
                  });
                });
                console.log(first, second);
              }
            }
          });

          // $(this).children(".class-li").addClass('rotate-oeg')
          // $(this).children(".class-i").animateCss('rotate-tsix' , function(e){
          // console.log("asdfghjkl")

          // } )
        }
      }
    });
  }
});

/*if (two_cards_track.length <2){

      element.css( "transform" , "rotateX(-180deg)" )
      childelement.css( "transform" , "rotateX(-360deg)" )
      two_cards_track.push(this)
      console.log(two_cards_track)
      }

      if (two_cards_track.length === 2){

        let first = two_cards_track[0]
        let second = two_cards_track[1]
        two_cards_track.pop()
        two_cards_track.pop()
        if (cards[$(first).children('.class-i').attr('data-no')].no === cards[$(second).children('.class-i').attr('data-no')].no ){
            $(first).on('click',function(){})
            $(second).on('click',function(){})
            counter += 2
        }else{
          let first_li = $(first).children('.class-li')
          let first_i = $(first).children('.class-i')
          let second_li = $(second).children('.class-li')
          let second_i = $(second).children('.class-i')
          console.log(second_li , second_i)
          console.log(first_li , first_i)
          first_li.css("transition-delay" , "1s")
          first_i.css("transition-delay", "1s")
          second_li.css("transition-delay" , "0s")
          second_i.css("transition-delay", "0s")
          first_li.css("transform" , "rotateX(0deg)")
          first_i.css("transform" , "rotateX(-180deg)")
          second_li.css("transform" , "rotateX(0deg)")
          second_i.css("transform" , "rotateX(-180deg)")
        }

      }else{

      }

  });*/
