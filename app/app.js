var myApp = angular.module('memoryGame', []).controller('memoryGameCtrl', [
  '$scope', 
  '$http',
  '$timeout',
   function($scope, $http, $timeout){

    vm = this;
    vm.cards = [];
    var selectedCard = null;
    var matchedCards = 0;
    vm.moves = 0;
    vm.game = {
      state: "Start"
    };

    vm.startGame = function(difficulty) {
      vm.game.state = "playing";
      vm.cards = [];
      matchedCards = 0;
      vm.moves = 0;

      $http.get('img/pngInfo.json')
        .then(function(response) {
          var i = 0;

          var gameDifficulty = parseInt(difficulty);
          while(i < gameDifficulty) {
            vm.cards.push(response.data[i]);
            vm.cards.push(jQuery.extend(true, {}, response.data[i]));
            i++ ;
          }  

          shuffle(vm.cards);
          
          vm.cards.forEach(function(element) {
            
            element.flipped = false;
          });
        });
    };

    vm.flipCard = function (card){
      if(card.flipped) {
        return;
      }
      if(!selectedCard) {
        selectedCard = card;
        card.flipped = true;
        return;

      } 

      card.flipped = true;

      if (selectedCard.id === card.id) {
        selectedCard = null;
        matchedCards++;
        if (matchedCards === parseInt(vm.game.difficulty)) {
          vm.game.state = 'complete';
        }
        vm.moves ++;
        return;
      }

      if(selectedCard.id !== card.id) {
        card.flipped = true;
        $timeout(function() {

          card.flipped = false;
          selectedCard.flipped = false;
          selectedCard = null;
        }, 400)
        vm.moves ++;
      }
    }

    var shuffle = function (array) {
      var m = array.length, t, i;

      // While there remain elements to shuffle…
      while (m) {

        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
      }

      return array;
    };
   }])