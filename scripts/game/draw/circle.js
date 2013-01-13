define([
  '../../mousePoint',
  'frozen/utils'
], function(mousePoint, utils){

  return function(ctx, geometries){
    var dist = utils.distance(geometries[0], {
      x: mousePoint.move.x,
      y: mousePoint.move.y
    });
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.arc(geometries[0].x, geometries[0].y, dist, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.stroke();
  };

});