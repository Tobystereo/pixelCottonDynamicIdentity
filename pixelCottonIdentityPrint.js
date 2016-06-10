/*

████████╗ ██████╗ ██████╗ ██╗   ██╗███████╗████████╗███████╗██████╗ ███████╗ ██████╗
╚══██╔══╝██╔═══██╗██╔══██╗╚██╗ ██╔╝██╔════╝╚══██╔══╝██╔════╝██╔══██╗██╔════╝██╔═══██╗
   ██║   ██║   ██║██████╔╝ ╚████╔╝ ███████╗   ██║   █████╗  ██████╔╝█████╗  ██║   ██║
   ██║   ██║   ██║██╔══██╗  ╚██╔╝  ╚════██║   ██║   ██╔══╝  ██╔══██╗██╔══╝  ██║   ██║
   ██║   ╚██████╔╝██████╔╝   ██║   ███████║   ██║   ███████╗██║  ██║███████╗╚██████╔╝
   ╚═╝    ╚═════╝ ╚═════╝    ╚═╝   ╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚══════╝ ╚═════╝

   PRESENTS

██████╗ ██████╗ ████████╗████████╗ ██████╗ ███╗   ██╗██████╗ ██╗██╗  ██╗███████╗██╗
██╔════╝██╔═══██╗╚══██╔══╝╚══██╔══╝██╔═══██╗████╗  ██║██╔══██╗██║╚██╗██╔╝██╔════╝██║
██║     ██║   ██║   ██║      ██║   ██║   ██║██╔██╗ ██║██████╔╝██║ ╚███╔╝ █████╗  ██║
██║     ██║   ██║   ██║      ██║   ██║   ██║██║╚██╗██║██╔═══╝ ██║ ██╔██╗ ██╔══╝  ██║
╚██████╗╚██████╔╝   ██║      ██║   ╚██████╔╝██║ ╚████║██║     ██║██╔╝ ██╗███████╗███████╗
╚═════╝ ╚═════╝    ╚═╝      ╚═╝    ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝

  a dynamic identity for a gaming brand

  For questions, contact me at hello@tobystereo.com

*/

//////////////////////////////////////////////////////////////////////////////////
//		Variables
//////////////////////////////////////////////////////////////////////////////////

var logoContainer, printOutputContainer, logo_width, logo_height;
var textfield = 'Your Name';
var textfieldOriginal = 'Your Name';
// array of functions for the rendering loop
var onRenderFcts= [];
var renderer, scene, camera, controls;
// storing all the elements
var shards = [];
// how many elements will be rendered
var numShards = games.length;
// store the rotation position of the elements
var shardRotation = [];

// lights
var light_ambient, light_01, light_02, light_03, light_mouse;

// the characers in the name
var chars = [];

//////////////////////////////////////////////////////////////////////////////////
//		Support Functions
//////////////////////////////////////////////////////////////////////////////////

// convenience function for mapping numbers from one range to another
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function setLogoSize() {
  logoContainer = document.getElementById('logoContainer');
  // 1004 x 650 are the pixel dimensions of standard business cards 8.5x5.5cm at 300dpi
  logo_width = 1004; // 1004
  logo_height = 650; // 65

  var w = document.getElementById('canvasWidth').value;
  var h = document.getElementById('canvasHeight').value;

  if(w > 0 && h > 0) {
    logo_width = w; // 1004
    logo_height = h; // 65
  }
}

function findGameIndexByName(game_name) {
    // find the game name from the body tag in the games data object.
    for (var i=0; i<games.length; i++) {
    // for each game check if there is a match of the name
    // both values are converted to lowercase to avoid errors due to case-sensitivity
      if(game_name.toLowerCase() == games[i].name.toLowerCase()) {
        // if there is a match, return the index
        return i;
        break;
      }
    }
}

var renderButton = document.getElementById('renderButton');
renderButton.addEventListener('click', function() {
  // 268435456
  var w = document.getElementById('canvasWidth').value;
  var h = document.getElementById('canvasHeight').value;

  if( w * h <= 268435456 ) {

    getText();
    while (logoContainer.hasChildNodes()) {
        logoContainer.removeChild(logoContainer.lastChild);
    }

    init();

  } else {
    alert('maximum render size exceeded, please choose smaller dimensions (width * height < 268435456)');
  }


});


function getText() {
  textfield = textfieldOriginal = document.getElementById('textfield').value;
  // remove non-alphanumeric characters
  textfield = textfield.toLowerCase();
  textfield = textfield.replace("/[A-Za-z0-9 \-_.\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]",'');
  chars = textfield.split('');

  if ( chars.length > 0 ) {
      numShards = chars.length;
  } else {
    numShards = 5;
  }

  return
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/*** ADDING SCREEN SHOT ABILITY ***/
// window.addEventListener("keyup", function(e){
//   //Listen to 'P' key
//   if(e.which !== 80) return;
//   generateImagefromCanvas();
// });

function generateImagefromCanvas() {

  var imgData, imgNode;

  var imgContainer = document.getElementById('outputContainer');

  try {
      imgData = renderer.domElement.toDataURL();

      while (imgContainer.hasChildNodes()) {
          imgContainer.removeChild(imgContainer.lastChild);
      }
  }
  catch(e) {
      alert("Sorry, this browser does not support taking screenshot of 3d context. Try Safari or Chrome.");
      return;
  }
 imgNode = document.createElement("img");
 imgNode.setAttribute('class', 'outputImage');
 imgNode.src = imgData;
 imgContainer.appendChild(imgNode);
}


//////////////////////////////////////////////////////////////////////////////////
//		Init
//////////////////////////////////////////////////////////////////////////////////

function init() {

  // sets the rendering size to the current size of the logo container element
  setLogoSize();

  // init renderer
  renderer	= new THREE.WebGLRenderer({
      antialias	: true,
      alpha: true,
      preserveDrawingBuffer: true
  });
  renderer.setSize( logo_width, logo_height );

  //////////////////////////////////////////////////////////////////////////////////
  //		Scene & Camera
  //////////////////////////////////////////////////////////////////////////////////

  // init scene and camera
  scene	= new THREE.Scene();
  camera	= new THREE.PerspectiveCamera(45, logo_width / logo_height, 0.01, 1000);
  camera.position.x = 1;
  camera.position.y = 1;
  camera.position.z = 3;
  // controls	= new THREE.OrbitControls(camera);


  for (var i=0; i<chars.length; i++) {
    // generate the element for this game
    var charCode = chars[i].charCodeAt(0);
    charCode = parseInt(charCode);
    if(charCode >= 97 && charCode <= 122) {
      var characterHue = charCode.map(97, 122, 0, 1);
      console.log(charCode + " " + characterHue);
    } else {
      console.log('not a lowercase character or an umlaut');
      var characterHue = Math.random();
    }

    // print color HSB
    // hue: map letter
    // saturation: 100%
    // brightness: 46%
    var randomSaturation = ( Math.random() * 72 + 28 ) / 100;
    var randomLightness = ( Math.random() * 36 + 46 ) / 100;

    // var characterColor = hslToRgb(characterHue, randomSaturation, randomLightness);
    var characterColor = hslToRgb(characterHue, Math.random(), Math.random());

    generateElement(i, characterColor, characterHue);
  }

  //////////////////////////////////////////////////////////////////////////////////
  //		Scene & Camera
  //////////////////////////////////////////////////////////////////////////////////

  light_ambient = new THREE.AmbientLight( 0x1F1E1D ); // soft white light
  scene.add( light_ambient );

  light_01 = new THREE.PointLight( 0x0f0f0f, 0.1, 100 );
  light_01.position.set( 50, -50, -5 );
  scene.add( light_01 );

  light_02 = new THREE.PointLight( 0x555555, 0.1, 100 );
  light_02.position.set( -50, 50, 50 );
  scene.add( light_02 );

  light_03 = new THREE.PointLight( 0x555555, 0.1, 100 );
  light_03.position.set( -50, 50, -50 );
  scene.add( light_03 );

  //////////////////////////////////////////////////////////////////////////////////
  //		Name
  //////////////////////////////////////////////////////////////////////////////////

  //create image
  var bitmap = document.createElement('canvas');
  var g = bitmap.getContext('2d');
  bitmap.width = 2000;
  bitmap.height = 1000;
  g.font = 'Bold 100px Helvetica';

  g.fillStyle = 'white';
  g.fillText(textfieldOriginal, 0, 100);
  // g.strokeStyle = 'black';
  // g.strokeText(textfield, 0, 20);

  // canvas contents will be used for a texture
  var text_texture = new THREE.Texture(bitmap)
  text_texture.needsUpdate = true;

  var text_geometry = new THREE.PlaneGeometry(1, .5);
  var text_material = new THREE.MeshBasicMaterial({map: text_texture, overdraw: 0.5, transparent: true});
  var text_mesh = new THREE.Mesh(text_geometry, text_material);

  text_mesh.position.x = 1.45;
  text_mesh.position.y = .6;
  text_mesh.position.z = 2;

  var showname = document.getElementById('showname').checked;

  if(showname) {
      scene.add(text_mesh);
  }


  //////////////////////////////////////////////////////////////////////////////////
  //		Logo Image
  //////////////////////////////////////////////////////////////////////////////////

  var image = 'logo_white_outline.png';
  var loader = new THREE.TextureLoader();
  loader.load( image, function(texture) {
    // 1728 × 908
    var geometry = new THREE.PlaneGeometry(0.4, 0.4/1.904761905);
    var material = new THREE.MeshBasicMaterial({map: texture, overdraw: 0.5, transparent: true});
    var mesh = new THREE.Mesh(geometry, material);

    var centered = document.getElementById('centered').checked;
    if(centered) {
      mesh.position.x = 1;
      mesh.position.y = 1;
      mesh.position.z = 2;
    } else {
      mesh.position.x = 0.65;
      mesh.position.y = 1.2;
      mesh.position.z = 2;
    }

    var showlogo = document.getElementById('showlogo').checked;
    console.log(showlogo);
    if(showlogo) {
        scene.add(mesh);
    }



    render();
  });


}


init();


//////////////////////////////////////////////////////////////////////////////////
//		generate the elements
//////////////////////////////////////////////////////////////////////////////////

function generateElement(index, color, hue) {
  // find the array index of this game in order to access its colors

  if ( index != null ) {
    // set the radius of the object
    var radiusFactor = numShards.map(0,25,0.4,0.0001);
    var shardRadius = Math.random() * radiusFactor;

    // Define the number of points of the object

    // create a random number
    var randomDetail = Math.random();
    // define the maximum number of points of the object
    // (round numbers are required, anything over 4 starts looking like a sphere)

    // make ensure that only 1/3 of elements has a nigher maximum
    if( randomDetail > 0.7 ) {
      randomDetail = 3;
    } else {
      randomDetail = 2;
    }

    // generate a random number between 0 and the defined maximum
    var shardDetail = Math.random() * randomDetail;
    // round the number
    shardDetail = Math.floor(shardDetail);
    // create the actual object (still needs to be styled and positioned)
    var shard = new THREE.TetrahedronGeometry(shardRadius, shardDetail);

    // get the RGB information from the games data object
    console.log(color);
    var shardColor = new THREE.Color(color[0], color[1], color[2]);
    // shardColor.setHSL(hue, 51, 76);


    var shard_material = new THREE.MeshPhongMaterial( {
      color: shardColor,
      shininess: 1000,
      shading: THREE.FlatShading,
      wireframe: true,
      wireframeLinewidth: 2,
      reflectivity: 10,
    } );
    var shard_mesh = new THREE.Mesh( shard, shard_material );
    shardRotation.push(Math.random(-3,3));

    var pos_x = Math.random() * 2;  // + 0.5
    var pos_y = Math.random() + 0.5;
    var pos_z = Math.random() * 0.5 + 1;

    shard_mesh.position.set( pos_x, pos_y, pos_z );

    var rotationX = Math.random();
    var rotationY = Math.random();
    var rotationZ = Math.random();
    shard_mesh.rotation.x = rotationX;
    shard_mesh.rotation.y = rotationY;
    shard_mesh.rotation.z = rotationZ;

    shards.push( shard_mesh );

    scene.add( shard_mesh );
  }
}

//////////////////////////////////////////////////////////////////////////////////
//		render the whole thing on the page
//////////////////////////////////////////////////////////////////////////////////

// handle window resize
window.addEventListener('resize', function(){
  setLogoSize();
  renderer.setSize( logo_width, logo_height );
  renderer.setPixelRatio( window.devicePixelRatio * 4 );
  // renderer.setSize( window.innerWidth, window.innerHeight )
  camera.aspect	= logo_width / logo_height;
  camera.updateProjectionMatrix();
}, false)

// get mouse position
document.onmousemove = getMousePosition;

var mouse_x_pos = 0;
var mouse_y_pos = 0;

function getMousePosition(e) {
 if (e == undefined) e = window.event;
 if (e.pageX || e.pageY) {
  mouse_x_pos = e.pageX;
  mouse_y_pos = e.pageY;
 }
 else if (e.clientX || e.clientY) {
  mouse_x_pos = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
  mouse_y_pos = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
 }
}

function render() {



  // render the scene
  onRenderFcts.push(function(){
    // only render the scene, when it is inside the viewport
    // if(logoContainer.scrollTop+logo_height >= document.body.scrollTop) {

      // rotateShards();

      // move one light with the mouse position
      // light_mouse.position.set( mouse_x_pos.map(0,window.innerWidth,-50,50), mouse_y_pos.map(0,window.innerHeight,50,-50), 80 );

      renderer.render( scene, camera );

    // }
  })

  // append the canvas element to the 'logoContainer' DOM element
  var rendererDomElement = renderer.domElement;
  logoContainer.appendChild(rendererDomElement);

  // run the rendering loop
  var lastTimeMsec= null
  requestAnimationFrame(function animate(nowMsec){
    // keep looping
    // requestAnimationFrame( animate );
    // measure time
    lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
    var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
    lastTimeMsec	= nowMsec
    // call each update function
    onRenderFcts.forEach(function(onRenderFct){
      onRenderFct(deltaMsec/1000, nowMsec/1000)
    })

    generateImagefromCanvas();
  });



}

// rotation speed, default is 0.01, less is slower
var SPEED = 0.01;

function rotateShards() {
  for(var i = 0; i < shards.length; i++) {
    shards[i].rotation.x -= SPEED * shardRotation[i];
    shards[i].rotation.y -= SPEED;
    shards[i].rotation.z -= SPEED * shardRotation[i];
  }
}


/*

██████╗ ███████╗ █████╗  ██████╗███████╗
██╔══██╗██╔════╝██╔══██╗██╔════╝██╔════╝
██████╔╝█████╗  ███████║██║     █████╗
██╔═══╝ ██╔══╝  ██╔══██║██║     ██╔══╝
██║     ███████╗██║  ██║╚██████╗███████╗
╚═╝     ╚══════╝╚═╝  ╚═╝ ╚═════╝╚══════╝

*/
