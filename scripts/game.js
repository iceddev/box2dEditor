define([
  './game/Box',
  './game/GameCore'
], function(Box, GameCore){

  var game = new GameCore({
    box: new Box()
  });

  return game;

});