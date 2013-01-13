define([
  '../mousePoint',
  '../currentGeom',
  '../tool',
  '../orderRectPts',
  './world',
  './draw/poly',
  './draw/rect',
  './draw/circle',
  'frozen/utils'
], function(mousePoint, currentGeom, tool, orderRectPts, world, drawPoly, drawRect, drawCircle, utils){

  var SCALE = 30;

  return function(ctx){
    ctx.lineWidth = 1;

    if(this.backImg){
      ctx.drawImage(this.backImg, 0, 0, this.canvas.width, this.backImg.height);
    } else {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    var localWorld = world.get();
    for (var id in localWorld) {
      var entity = localWorld[id];
      if(!entity.staticBody || !this.runSimulation || this.showStatic){
        entity.draw(ctx, SCALE);
      }
    }

    var geometries = currentGeom.get() || [];
    var lineWidth = ctx.lineWidth;
    ctx.lineWidth = 1;

    if(!geometries.length){
      return;
    }

    if(tool.is('polygon')){
      drawPoly.apply(this, [ctx, geometries]);
    } else if(tool.is('rectangle')){
      drawRect.apply(this, [ctx, geometries]);
    } else if(tool.is('circle')){
      drawCircle.apply(this, [ctx, geometries]);
    }

    ctx.lineWidth = lineWidth;
  };

});