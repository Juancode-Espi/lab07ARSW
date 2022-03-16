var app = (function () {

  var _authname = '';
  var listBluePrints = [];
  var points = 0;
  var clicks = 0;
  var lista = [];
  var current = {};

  var _loadBlueprints = (data) => {
    
    data.map((bluePrint) => {
      const object = {};
      object.auth = bluePrint.author;
      object.name = bluePrint[Object.keys(bluePrint)[2]];
      object.nPoints = bluePrint[Object.keys(bluePrint)[1]].length;
      listBluePrints.push(object);
    })
    listBluePrints.map(obj => {
        $('#table > tbody:last')
          .append($(`
              <tr>
                  <td>${obj.name}</td>
                  <td>${obj.nPoints}</td>
                  <td><button class="btn btn-primary">Open</button></td>
              </tr>`).on("click", "button", () => drawCanvas(obj.auth, obj.name)));
        points += obj.nPoints;
        $("#totalPoints").html("Total user Points: " + points);
      });

  }

  function saveBlueprints() {
    $('#table > tbody').empty();
    listBlueprints = [];
    points = 0;
    clicks = 0;
    console.log(current);
    if($.isEmptyObject(current)){
      apiclient.getBlueprints(_loadBlueprints);
    }else{
      if(lista.length != 0){
        apiclient.updateBlueprints(current,lista);
      }
    emptyList();
    }
    


  }
  var _setAuthorName = (name) => {
    let text = name + "'s Blueprints";
    $('#author').html(text);
  }

  var setBlueprintsList = function (auth) {
    $('#table > tbody').empty();
    _authname = auth;
    if (_authname == '') {
      alert('Please enter a name');
    }
    else {
      listBluePrints = [];
      points = 0;
      clicks = 0;
      _setAuthorName(_authname);
      apiclient.getBlueprintsByAuthor(_authname, _loadBlueprints);
      console.log(listBluePrints);
      console.log(_authname);
      
    }

  };
  function createNewBluePrint(bp){
    apiclient.createNewBluePrint(_authname,bp,lista);
    emptyList();
    clearCanvas();
  }
  function getOffset(obj) {
          var offsetLeft = 0;
          var offsetTop = 0;
          do {
            if (!isNaN(obj.offsetLeft)) {
                offsetLeft += obj.offsetLeft;
            }
            if (!isNaN(obj.offsetTop)) {
                offsetTop += obj.offsetTop;
            }
          } while(obj = obj.offsetParent );
          return {left: offsetLeft, top: offsetTop};
      }

  const drawCanvas = (author, bname) => {
    clicks = 0;
    apiclient.getBlueprintsByNameAndAuthor(author, bname, (data) => {  
      current = data;
      const points = data.points;
      drawEmptyCanvas(points);
      emptyList();
    })
  }

  function iniCanvas(){
    let canvas = $('#canvas')[0];
    if(window.PointerEvent) {
        canvas.addEventListener("pointerdown", function(event){
          var offSet = getOffset(canvas);
          var canvasX = (event.pageX - offSet["left"]);
          var canvasY = (event.pageY - offSet["top"]);
          clicks+=1;
          lista.push({x:canvasX,y:canvasY});
          drawEmptyCanvas(lista);
          
          console.log("El numero de clicks es : " + clicks);
          console.log(lista);
        });
      }
      else {
        canvas.addEventListener("mousedown", function(event){ 
          var offSet = getOffset(canvas);
          var canvasX = (event.pageX - offSet["left"]);
          var canvasY = (event.pageY - offSet["top"]);
          lista.push({x:canvasX,y:canvasY});      
          drawEmptyCanvas(lista);
          }
        );
      } 
  }

  function drawEmptyCanvas(points){
    let canvas = $('#canvas')[0];
    canvas.width = canvas.width;
      if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        /**if(points.length > 2){
          points.shift();
        }**/
        
        for (var i = 0; i < points.length; i++) {
          console.log(points[i].x, points[i].y);
          ctx.lineTo(points[i].x, points[i].y);
          if(points.length == i+1){
            ctx.moveTo(points[i].x, points[i].y);
          }
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
       // ctx.closePath();
        ctx.stroke();
      }
  }
  function deleteC(){
     if(!($.isEmptyObject(current))){
      apiclient.deleteBluePrint(current);
      emptyList();
      clearCanvas();
      $('#table > tbody').empty();
    }
  }
  function clearCanvas(){
        let canvas = $("#canvas")[0];
        let canvas2d = canvas.getContext("2d");
        canvas2d.clearRect(0,0,canvas.width,canvas.height);
        canvas2d.beginPath();
    }

  function emptyList(){
    lista = [];
  }
  return {
    setBlueprintsList: setBlueprintsList,
    iniCanvas: iniCanvas,
    save: saveBlueprints,
    createNewBluePrint:createNewBluePrint,
    deleteC:deleteC
  };

})();