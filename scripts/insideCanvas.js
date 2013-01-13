define(function(){

  var insideCanvas = function(pt, game){
    if((pt.x < 0) || (pt.x >  game.width) || (pt.y < 0) || (pt.y > game.height)){
      return false;
    } else {
      return true;
    }
  };

  return insideCanvas;

});