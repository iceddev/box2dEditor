/*
 *

 Copyright 2011 Luis Montes

http://azprogrammer.com

 */

 require(['scripts/convexHull', 'frozen/GameCore', 'frozen/ResourceManager', 'dojo/keys', 'frozen/utils', 'frozen/box2d/Box', 'frozen/box2d/RectangleEntity', 'frozen/box2d/PolygonEntity', 'frozen/box2d/MultiPolygonEntity', 'frozen/box2d/CircleEntity', 'scripts/DNDFileController' , 'dojo/on', 'dojo/dom', 'dojo/_base/lang', 'dojo/domReady!'],
 function(convexHull, GameCore, ResourceManager, keys, utils, Box, Rectangle, Polygon, MulitPolygon, Circle, DNDFileController, on, dom, lang){

     
  var SCALE = 30;
  var NULL_CENTER = {x:null, y:null};
  var MAX_POLY_SIDES = 10;
  var POINT_RADIUS = 4;

  var DYNAMIC_COLOR = 'rgba(0,255,0,0.4)';
  var ZONE_COLOR = 'rgba(255,0,0,0.2)';

  
  var canvas = dom.byId('canvas');
  var gravityXField = dom.byId('gravityX');
  var gravityYField = dom.byId('gravityY');
  var undoBtn = dom.byId('undoBtn');
  var xdisp = dom.byId('xdisp');
  var ydisp = dom.byId('ydisp');

  var gravity = {
    x: parseFloat(gravityXField.value, 10),
    y: parseFloat(gravityYField.value, 10)
  };


  var mouseDownPt = null;
  var mouseMovePt = null;
  var rm = null;
  
  var backImg = new Image();
  
  
  //tool stuff
  var tool = 'rectangle';
  var toolType = 'static';
  var currentGeom = null;
  var geomId = 30;
  var extraObjs = [];
  var dnd;
  var showHidden = true;
  var runSimulation = true;
  var showStatic = true;

  var jsonObjs = [];
  var undoObjs = [];
  var zoneEntities = [];

    
  var world = {};
  var worker = null;
  var bodiesState = null;
  var box = null;


  var orderRectPts = function(pts){
    var retVal = [];
    var pt1,pt2;
    if(pts[1].x < pts[0].x){
      pt1 = pts[1];
      pt2 = pts[0];
    }else{
      pt1 = pts[0];
      pt2 = pts[1];
    }
    retVal.push(pt1);
    retVal.push(pt2);
    return retVal;
  };


   
  var createPolyJSON = function(){
    if(currentGeom && currentGeom.length > 2){

      var points = convexHull(currentGeom);

      var poly = {points: points};

      var avg = utils.averagePoints(poly.points);
      poly.x = avg.x;
      poly.y = avg.y;

      poly.points = utils.translatePoints(poly.points, {x: -poly.x, y: -poly.y});

      poly.staticBody = toolType === 'static' ? true : false;
      if(toolType === 'zone'){
        poly.type = 'PolygonZone';
      }else{
        poly.type = 'Polygon';
      }

      return poly;
    }
  };


  var createRectJSON = function(){

    if(currentGeom && currentGeom.length == 2){
      var pts = orderRectPts(currentGeom);

      var rect = {
        x: ((pts[1].x - pts[0].x)/2 + pts[0].x),
        y: ((pts[1].y - pts[0].y)/2 + pts[0].y),
        halfWidth: ((pts[1].x - pts[0].x)/2 ),
        halfHeight: ((pts[1].y - pts[0].y)/2 )
      };
      rect.staticBody = toolType === 'static' ? true : false;
      if(toolType === 'zone'){
        rect.type = 'RectangleZone';
      }else{
        rect.type = 'Rectangle';
      }
      return rect;

    }
  };

  
  var createCircleJSON = function(){
    
    if(currentGeom && currentGeom.length == 2){
      
      var dist =  utils.distance(currentGeom[0],currentGeom[1]);
      var circ = {x: currentGeom[0].x, y: currentGeom[0].y, radius: dist};
      circ.staticBody = toolType === 'static' ? true : false;
      if(toolType === 'zone'){
        circ.type = 'CircleZone';
      }else{
        circ.type = 'Circle';
      }
      
      return circ;
    }
  };


  
  var getTool = function(){
    var tools = dom.byId('toolForm').tool;

    for (var i = 0; i < tools.length; i++) {
      if(tools[i].checked){
        tool = tools[i].value;
      }
    }
    
    return tool;
  };

  var getToolType = function(){
    var toolTypes = dom.byId('toolForm').toolType;

    for (var i = 0; i < toolTypes.length; i++) {
      if(toolTypes[i].checked){
        toolType = toolTypes[i].value;
      }
    }
    
    return toolType;
  };

  
  var insideCanvas = function(pt){
    if((pt.x < 0) || (pt.x >  game.width) || (pt.y < 0) || (pt.y > game.height)){
      return false;
    }else{
      return true;
    }
  };
  

      
        
      
      
      
      var toolElements = dom.byId('toolForm').tool;
      for (var i = 0; i < toolElements.length; i++) {
        on(toolElements[i], 'change', function(e){
          currentGeom = null;
          tool = getTool();
          console.log(tool);
        });
      }

      var toolTypeElements = dom.byId('toolForm').toolType;
      for (var i = 0; i < toolTypeElements.length; i++) {
        on(toolTypeElements[i], 'change', function(e){
          currentGeom = null;
          toolType = getToolType();
          console.log(tool);
        });
      }
      


      on(dom.byId('load'), 'click', function(e){
        try{
            
          var objStr = dom.byId('output').value;
          console.log(objStr);
          
          var jsobj = JSON.parse(objStr);
          jsonObjs = jsobj.objs;

          createBodies();
          
          console.log(jsobj);

      
        }catch(er){
          console.info('error loading json',er);
        }
      });

      on(undoBtn, 'click', function(e){
        if(jsonObjs.length){
          undoObjs.push(jsonObjs.pop());
          createBodies();
        }

      });
      
      
      on(dom.byId('runSimulation'), 'change', function(e){
        runSimulation = dom.byId('runSimulation').checked;
      });
      
      on(dom.byId('showStatic'), 'change', function(e){
        showStatic = dom.byId('showStatic').checked;
      });

      
      on(document, 'electstart', function(e){
        e.preventDefault();
        return false;
      });
      
       
      dnd = new DNDFileController({id:'canvas',
        drop: function(e){
          try{
          
            
            var files = e.dataTransfer.files;
      
            //only care about 1 image
            if(files && files.length == 1 && files[0].type.match(/image.*/)){
              var file = files[0];
              var reader = new FileReader();
              
              reader.onerror = function(evt) {
                console.log('Error code: ' + evt.target.error.code);
              };
                
              reader.onload = function(evt) {
                  if (evt.target.readyState == FileReader.DONE) {
                    
                    //console.log('evt',evt);
                    console.log('base64 length',evt.target.result.length);
                    
                    //console.log('preload',backImg.height, backImg.width);
                    backImg.onload = function(){
                      //console.log('load',backImg.height, backImg.width);
                      game.stop();
                      canvas.height = backImg.height;
                      canvas.width = backImg.width;
                      loadGame();
                    };

                    backImg.src = evt.target.result;
                  }
                  
              };
                
              reader.readAsDataURL(file);

              console.log(file, reader);

              this.dragleave(e);
              
            }
            
          }catch(dropE){
            console.log('DnD error',dropE);
          }
        }
      });
      

      var inputHanlder = function(im){
        var mp;

        if(im.mouseAction.position){
          xdisp.innerHTML = im.mouseAction.position.x;
          ydisp.innerHTML = im.mouseAction.position.y;
          mouseMovePt = im.mouseAction.position;
        }

        if(im.mouseAction.isPressed() && !mouseDownPt){
          

          if(insideCanvas(im.mouseAction.startPosition)){
            mouseDownPt = im.mouseAction.startPosition;
            mp = mouseDownPt;
            if(tool == 'rectangle'){
              console.log('start rect',mp);
              currentGeom = [];
              currentGeom.push(mp);
            }
            else if(tool == 'circle'){
              console.log('start circle',mp);
              currentGeom = [];
              currentGeom.push(mp);
            }
            else if(tool == 'polygon'){
              console.log('polygon',mp);
              currentGeom = currentGeom || [];
              
              if(currentGeom.length === (MAX_POLY_SIDES - 1)){
                currentGeom.push(mp);
                jsonObjs.push(createPolyJSON());
                createBodies();
                currentGeom = null;
              }else if(currentGeom.length > 1 && utils.distance(currentGeom[0], mp) <= POINT_RADIUS){
                jsonObjs.push(createPolyJSON());
                createBodies();
                currentGeom = null;
              }else{
                currentGeom.push(mp);
              }
            }
          }

        }

        //mouse released
        if(mouseDownPt && !im.mouseAction.isPressed()){
          mp = im.mouseAction.endPosition;

          if(tool == 'rectangle'){
            if(currentGeom && currentGeom.length ==1){
              currentGeom.push(mp);
              jsonObjs.push(createRectJSON());
              createBodies();
              currentGeom = null;
            }
          }else if(tool == 'circle'){
            if(currentGeom && currentGeom.length ==1){
              currentGeom.push(mp);
              jsonObjs.push(createCircleJSON());
              createBodies();
              currentGeom = null;
            }
          }

            mouseDownPt = null;
        }
        

      };

      var render = function(ctx){
        ctx.lineWidth = 1;
        ctx.clearRect ( 0 , 0 , game.canvas.width, game.canvas.height);
        if(backImg){
          ctx.drawImage(backImg,0, 0, game.canvas.width, backImg.height);
        }
        var lineWidth = 1;
        
        for (var id in world) {
          var entity = world[id];
          if(!entity.staticBody || !runSimulation || showStatic){
            entity.draw(ctx, SCALE);
          }
          
        }

        zoneEntities.forEach(function(ze){
          ze.draw(ctx,1);
        });
              
              
        if(tool == 'polygon' && currentGeom){
         if(currentGeom.length > 0){
            lineWidth = ctx.lineWidth;
            ctx.lineWidth = 1;

            //draw poly points
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            for(var i = 0; i < currentGeom.length; i++){
              ctx.beginPath();
              ctx.arc(currentGeom[i].x, currentGeom[i].y, POINT_RADIUS, 0, Math.PI * 2, true);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
            }

            
            if((currentGeom.length > 1) && this.inputManager.mouseAction.position && (utils.distance(currentGeom[0], this.inputManager.mouseAction.position) <= POINT_RADIUS)){
              ctx.strokeStyle = 'yellow';
              ctx.fillStyle = 'black';
              ctx.lineWidth = 4;
              ctx.beginPath();
              ctx.arc(currentGeom[0].x, currentGeom[0].y, POINT_RADIUS, 0, Math.PI * 2, true);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
              ctx.lineWidth = 1;
            }
            
            ctx.strokeStyle = "red";
            ctx.beginPath();

            for(i =1; i < currentGeom.length; i++){
              ctx.moveTo(currentGeom[i-1].x, currentGeom[i-1].y );
              ctx.lineTo(currentGeom[i].x, currentGeom[i].y);
            }
            
            if(mouseMovePt){
              ctx.moveTo(currentGeom[currentGeom.length -1].x, currentGeom[currentGeom.length -1].y );
              ctx.lineTo(mouseMovePt.x, mouseMovePt.y);
            }
            
            
            ctx.stroke();
            ctx.closePath();

            ctx.lineWidth = lineWidth;
          }
          
          
        }
        else if((tool == 'rectangle') && currentGeom){
         if(currentGeom.length > 0){
          lineWidth = ctx.lineWidth;
            ctx.lineWidth = 1;
     
          var pts = orderRectPts([currentGeom[0],{x:mouseMovePt.x,y:mouseMovePt.y}]);
          ctx.strokeStyle = 'red';
          
          ctx.strokeRect(pts[0].x,pts[0].y, pts[1].x -pts[0].x, pts[1].y -pts[0].y);
          
     
            ctx.lineWidth = lineWidth;
         }
        }
       else if(tool == 'circle' && currentGeom){
           if(currentGeom.length > 0){
              lineWidth = ctx.lineWidth;
                ctx.lineWidth = 1;
        
                var dist =  utils.distance(currentGeom[0],{x:mouseMovePt.x,y:mouseMovePt.y});
                ctx.strokeStyle = 'red';
                ctx.beginPath();
                ctx.arc(currentGeom[0].x, currentGeom[0].y, dist, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.stroke();

                ctx.lineWidth = lineWidth;
            }
       }
    };

    var update = function(millis){
      if(runSimulation){
        box.update(millis);
        box.updateExternalState(world);
      }

    };

    var loadGame = function(){
      game = new GameCore({
          canvas: canvas,
          update : update,
          handleInput: inputHanlder,
          draw: render
      });
      
      box = new Box({intervalRate:60, adaptive:false, width:game.width, height:game.height, scale:SCALE, gravityY:gravity.y, gravityX:gravity.x });
      
      game.run();
    };

    var createBodies = function(){
      var outputStr = JSON.stringify({objs:jsonObjs});
      if(jsonObjs.length){
        undoBtn.disabled = false;
      }else{
        undoBtn.disabled = true;
      }
      dom.byId('output').value = outputStr;
      gravity = {
        x: parseFloat(gravityXField.value, 10),
        y: parseFloat(gravityYField.value, 10)
      };
      
      box = new Box({intervalRate:60, adaptive:false, width:game.width, height:game.height, scale:SCALE,gravityY:gravity.y, gravityX: gravity.x});
      world = {};
      zoneEntities = [];
      //TODO Dry this up
      jsonObjs.forEach(function(obj){
        var ent;
        if(obj.type === 'Rectangle'){
          geomId++;
          if(!obj.staticBody){
            obj.color = obj.color || DYNAMIC_COLOR;
          }
          ent = new Rectangle(obj);
          ent.id = geomId;
          world[geomId] = ent;
          ent.scaleShape(1 / SCALE);
          box.addBody(ent);
        }else if(obj.type === 'Circle'){
          geomId++;
          if(!obj.staticBody){
            obj.color = obj.color || DYNAMIC_COLOR;
          }
          ent = new Circle(obj);
          ent.id = geomId;
          world[geomId] = ent;
          ent.scaleShape(1 / SCALE);
          box.addBody(ent);
        }else if(obj.type === 'Polygon'){
          geomId++;
          if(!obj.staticBody){
            obj.color = obj.color || DYNAMIC_COLOR;
          }
          ent = new Polygon(obj);
          ent.id = geomId;
          world[geomId] = ent;
          ent.scaleShape(1 / SCALE);
          box.addBody(ent);
        }else if(obj.type === 'RectangleZone'){
          obj.color = obj.color || ZONE_COLOR;
          ent = new Rectangle(obj);
          zoneEntities.push(ent);
        }else if(obj.type === 'CircleZone'){
          obj.color = obj.color || ZONE_COLOR;
          ent = new Circle(obj);
          zoneEntities.push(ent);
        }else if(obj.type === 'PolygonZone'){
          obj.color = obj.color || ZONE_COLOR;
          ent = new Polygon(obj);
          zoneEntities.push(ent);
        }

      });
    };
      
      
    loadGame();
    

});