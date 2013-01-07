/**

 Copyright 2011 Luis Montes

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

**/

 /**
 * The InputManager handles DOM events for use in games.
 * @name InputManager
 * @class InputManager
 */
define(['dojo/_base/declare', 'dojo/on', 'dojo/dom', 'dojo/dom-geometry', 'dojo/_base/lang', 'dojo/domReady!'],
  function(declare, on, dom, domGeom, lang){

  return declare(null, {
      node: null, //the DOM element
        borderStyle: null,
        borderDropStyle : '3px dashed red',
    
        constructor: function(/* Object */args){
            declare.safeMixin(this, args);
            if(!this.node){
              this.node = dom.byId(this.id);
            }
            on(this.node, 'dragenter', lang.hitch(this, "dragenter"));
            on(this.node, 'dragover', lang.hitch(this, "dragover"));
            on(this.node, 'dragleave', lang.hitch(this, "dragleave"));
            on(this.node, 'drop', lang.hitch(this, "drop"));

            this.borderStyle = this.node.style.border;
        },
        dragenter : function(e) {
          e.stopPropagation();
          e.preventDefault();
          this.node.style.border = this.borderDropStyle;
          
        },

        dragover : function(e) {
          e.stopPropagation();
          e.preventDefault();
        },

        dragleave : function(e) {
          e.stopPropagation();
          e.preventDefault();
         // this.node.classList.remove('rounded');
          this.node.style.border = this.borderStyle;
        },
        
        preDrop: function(e){
          this.node.style.border = this.borderStyle;
          e.stopPropagation();
          e.preventDefault();
        
          this.drop(e);
        },
        
        drop: function (e){
          
          var errorCallback = function(evt) {
                   console.log('Error code: ' + evt.target.error.code);
          };

          var loadCallback = function(aFile){
            return function(evt) {
                    if (evt.target.readyState == FileReader.DONE) {
                      //console.log('evt',evt);
                      console.log('base64 length',evt.target.result.length);
                    }
                  };
            };

          try{
            
        
              var files = e.dataTransfer.files;
        
              for (var i = 0; i < files.length; i++) {
                // FileReader
                var reader = new FileReader();
                console.log('file',file[i]);
                
                reader.onerror = errorCallback;

                reader.onload = loadCallback(file[i]);
        
                reader.readAsDataURL(file[i]);
              }
        
              return false;
            
            
          }catch(dropE){
            console.log('DnD error',dropE);
          }
          
        }
  });

});
