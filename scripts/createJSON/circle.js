define([
  '../toolType',
  'frozen/utils'
], function(toolType, utils){

  var createCircleJSON = function(currentGeom){
    if(currentGeom && currentGeom.length == 2){

      var dist =  utils.distance(currentGeom[0], currentGeom[1]);
      var circ = {
        x: currentGeom[0].x,
        y: currentGeom[0].y,
        radius: dist
      };
      circ.staticBody = toolType.is('static');
      circ.zone = toolType.is('zone');
      circ.type = 'Circle';

      return circ;
    }
  };

  return createCircleJSON;

});