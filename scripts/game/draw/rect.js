define([
  '../../mousePoint',
  '../../orderRectPts'
], function(mousePoint, orderRectPts){

  return function(ctx, geometries){
    var pts = orderRectPts([geometries[0], {
      x: mousePoint.move.x,
      y: mousePoint.move.y
    }]);
    ctx.strokeStyle = 'red';

    ctx.strokeRect(pts[0].x, pts[0].y, pts[1].x - pts[0].x, pts[1].y - pts[0].y);
  };

});