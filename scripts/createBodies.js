define([
  './game',
  './jsonObjs',
  './game/world',
  './game/Box',
  'frozen/box2d/RectangleEntity',
  'frozen/box2d/PolygonEntity',
  'frozen/box2d/CircleEntity',
  'dojo/_base/lang',
  'dojo/dom'
], function(game, jsonObjs, world, Box, Rectangle, Polygon, Circle, lang, dom){

  var SCALE = 30;
  var DYNAMIC_COLOR = 'rgba(0,255,0,0.4)';
  var ZONE_COLOR = 'rgba(255,0,0,0.2)';

  var geomId = 0;

  var undoBtn = dom.byId('undoBtn');

  var createBodies = function(){
    dom.byId('output').value = JSON.stringify({
      objs:jsonObjs
    }, null, '  ');

    if(jsonObjs.length){
      undoBtn.disabled = false;
    } else {
      undoBtn.disabled = true;
    }

    game.box = new Box();
    var localWorld = {};
    jsonObjs.forEach(function(obj){
      var ent;

      if(obj.zone){
        obj.color = obj.color || ZONE_COLOR;
      }

      if(obj.type === 'Rectangle'){
        ent = new Rectangle(obj);
      } else if(obj.type === 'Circle'){
        ent = new Circle(obj);
      } else if(obj.type === 'Polygon'){
        ent = new Polygon(obj);
      }

      if(!obj.staticBody){
        obj.color = obj.color || DYNAMIC_COLOR;
      }

      if(!obj.geomId){
        geomId++;
      }
      ent.id = geomId;
      localWorld[geomId] = ent;
      ent.scaleShape(1 / SCALE);

      if(!obj.zone){
        game.box.addBody(ent);
      }

    });

    world.set(localWorld);
  };

  return createBodies;

});