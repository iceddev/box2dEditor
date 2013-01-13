define([
  './DNDFileController',
  './game/Box',
  './game/GameCore',
  'dcl'
], function(DNDFileController, Box, GameCore, dcl){

  return dcl([DNDFileController], {
    id: 'canvas',
    drop: function(e){
      try {
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
              console.log('base64 length',evt.target.result.length);

              var backImg = new Image();

              backImg.onload = function(){
                game.stop();

                var game = new GameCore({
                  backImg: backImg,
                  height: backImg.height,
                  width: backImg.width,
                  box: new Box()
                });

                game.run();
              };

              backImg.src = evt.target.result;
            }
          };

          reader.readAsDataURL(file);

          console.log(file, reader);

          this.dragleave(e);
        }
      } catch(dropE){
        console.log('DnD error',dropE);
      }
    }
  });

});