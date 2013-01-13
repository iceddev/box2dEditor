define([
  '../../mousePoint',
  'frozen/utils'
], function(mousePoint, utils){

  var POINT_RADIUS = 4;

  return function(ctx, geometries){
    //draw poly points
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    geometries.forEach(function(geometry){
      ctx.beginPath();
      ctx.arc(geometry.x, geometry.y, POINT_RADIUS, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });

    if((geometries.length > 1) && this.inputManager.mouseAction.position && (utils.distance(geometries[0], this.inputManager.mouseAction.position) <= POINT_RADIUS)){
      ctx.strokeStyle = 'yellow';
      ctx.fillStyle = 'black';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(geometries[0].x, geometries[0].y, POINT_RADIUS, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.lineWidth = 1;
    }

    ctx.strokeStyle = "red";
    ctx.beginPath();

    geometries.forEach(function(geometry, idx){
      if(idx > 0){
        ctx.moveTo(geometries[idx - 1].x, geometries[idx - 1].y);
        ctx.lineTo(geometry.x, geometry.y);
      }
    });

    if(mousePoint.move){
      ctx.moveTo(geometries[geometries.length - 1].x, geometries[geometries.length - 1].y );
      ctx.lineTo(mousePoint.move.x, mousePoint.move.y);
    }

    ctx.stroke();
    ctx.closePath();
  };

});