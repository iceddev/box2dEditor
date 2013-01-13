define([
  '../mousePoint',
  '../currentGeom',
  '../jsonObjs',
  '../tool',
  '../insideCanvas',
  '../createBodies',
  '../createJSON/rect',
  '../createJSON/poly',
  '../createJSON/circle',
  'frozen/utils',
  'dojo/dom'
], function(mousePoint, currentGeom, jsonObjs, tool, insideCanvas, createBodies, createRectJSON, createPolyJSON, createCircleJSON, utils, dom){

  var MAX_POLY_SIDES = 10;
  var POINT_RADIUS = 4;

  var xdisp = dom.byId('xdisp');
  var ydisp = dom.byId('ydisp');

  return function(im){
    var newGeom;
    var mp;

    if(im.mouseAction.position){
      xdisp.innerHTML = im.mouseAction.position.x;
      ydisp.innerHTML = im.mouseAction.position.y;
      mousePoint.move = im.mouseAction.position;
    }

    if(im.mouseAction.isPressed() && !mousePoint.down){


      if(insideCanvas(im.mouseAction.startPosition, this)){
        mousePoint.down = im.mouseAction.startPosition;
        mp = mousePoint.down;
        if(tool.is('rectangle')){
          console.log('start rect',mp);
          newGeom = [];
          newGeom.push(mp);
          currentGeom.set(newGeom);
        }
        else if(tool.is('circle')){
          console.log('start circle',mp);
          newGeom = [];
          newGeom.push(mp);
          currentGeom.set(newGeom);
        }
        else if(tool.is('polygon')){
          console.log('polygon',mp);
          newGeom = currentGeom.get() || [];

          if(newGeom.length === (MAX_POLY_SIDES - 1)){
            newGeom.push(mp);
            currentGeom.set(newGeom);
            jsonObjs.push(createPolyJSON(newGeom));
            createBodies();
            currentGeom.set(null);
          }else if(newGeom.length > 1 && utils.distance(newGeom[0], mp) <= POINT_RADIUS){
            jsonObjs.push(createPolyJSON(newGeom));
            createBodies();
            currentGeom.set(null);
          }else{
            newGeom.push(mp);
            currentGeom.set(newGeom);
          }
        }
      }

    }

    //mouse released
    if(mousePoint.down && !im.mouseAction.isPressed()){
      mp = im.mouseAction.endPosition;
      newGeom = currentGeom.get();
      if(tool.is('rectangle')){
        if(newGeom && newGeom.length ==1){
          newGeom.push(mp);
          jsonObjs.push(createRectJSON(newGeom));
          createBodies();
          currentGeom.set(null);
        }
      }else if(tool.is('circle')){
        if(newGeom && newGeom.length ==1){
          newGeom.push(mp);
          jsonObjs.push(createCircleJSON(newGeom));
          createBodies();
          currentGeom.set(null);
        }
      }

        mousePoint.down = null;
    }


  };

});