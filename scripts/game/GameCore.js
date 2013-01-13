define([
  './world',
  './draw',
  './handleInput',
  'dcl',
  'frozen/GameCore'
], function(world, draw, handleInput, dcl, GameCore){

  return dcl(GameCore, {
    runSimulation: true,
    showStatic: true,
    canvasId: 'canvas',
    handleInput: handleInput,
    update: function(millis){
      if(this.runSimulation){
        this.box.update(millis);
        this.box.updateExternalState(world.get());
      }
    },
    draw: draw
  });

});