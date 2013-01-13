define([
  '../toolType',
  '../convexHull',
  'frozen/utils'
], function(toolType, convexHull, utils){

  var createPolyJSON = function(currentGeom){
    if(currentGeom && currentGeom.length > 2){
      var points = convexHull(currentGeom);

      var poly = {points: points};

      var avg = utils.averagePoints(poly.points);
      poly.x = avg.x;
      poly.y = avg.y;

      poly.points = utils.translatePoints(poly.points, {x: -poly.x, y: -poly.y});

      poly.staticBody = toolType.is('static');
      poly.zone = toolType.is('zone');
      poly.type = 'Polygon';

      return poly;
    }
  };

  return createPolyJSON;

});