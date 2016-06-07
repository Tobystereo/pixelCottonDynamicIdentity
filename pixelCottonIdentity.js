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
//		Support Functions
//////////////////////////////////////////////////////////////////////////////////

// convenience function for mapping numbers from one range to another
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function setLogoSize() {
  logoContainer = document.getElementById('logoContainer');
  logo_width = logoContainer.offsetWidth; // 640
  logo_height = logoContainer.offsetHeight; // 480
}

function findGameIndexByName(game_name) {
    for (var i=0; i<games.length; i++) {
      if(game_name == games[i].name) {
        return i;
        break;
      }
    }
}

//////////////////////////////////////////////////////////////////////////////////
//		Init
//////////////////////////////////////////////////////////////////////////////////

var logoContainer, logo_width, logo_height;

// sets the rendering size to the current size of the logo container element
setLogoSize();

// init renderer
var renderer	= new THREE.WebGLRenderer({
  antialias	: true,
  alpha: true
});
renderer.setSize( logo_width, logo_height );

//////////////////////////////////////////////////////////////////////////////////
//		Scene & Camera
//////////////////////////////////////////////////////////////////////////////////

// init scene and camera
var scene	= new THREE.Scene();
var camera	= new THREE.PerspectiveCamera(45, logo_width / logo_height, 0.01, 1000);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 3;
// var controls	= new THREE.OrbitControls(camera);

// storing all the elements
var shards = [];

var games_mentioned_in_body_tag = document.body.getAttribute('data-games');
var games_on_page = games_mentioned_in_body_tag.split(',');
console.log('games_on_page: ' + games_on_page);
console.log(games_on_page.length);
console.log(games_on_page);

// how many elements will be rendered
var numShards = games_on_page.length;
// store the rotation position of the elements
var shardRotation = [];

if (games_on_page.length > 0) {
  console.log('there are games mentioned in the body tag');
  // if there are games mentioned in the data attribute on the body tag
  // create one object for each game represented on the page
  for (var i=0; i<games_on_page.length; i++) {
    // remove all spaces from each game name
    // (prevents error when comma-separated list of games in body tag includes a space)
    games_on_page[i] = games_on_page[i].replace(/ +?/g, '');

    // find the index of the current game
    var index = findGameIndexByName(games_on_page[i]);
    // generate the element for this game
    generateElement(index);
  }
} else {
  // if there is no game mentioned in the body tag
  // create one object for all games
  for (var i=0; i<games.length; i++) {
    // generate the element for this game
    generateElement(i);
  }
}

// array of functions for the rendering loop
var onRenderFcts= [];

//////////////////////////////////////////////////////////////////////////////////
//		Scene & Camera
//////////////////////////////////////////////////////////////////////////////////

var light_ambient = new THREE.AmbientLight( 0x1F1E1D ); // soft white light
scene.add( light_ambient );

var light_01 = new THREE.PointLight( 0x0f0f0f, 0.1, 100 );
light_01.position.set( 50, -50, -5 );
scene.add( light_01 );

var light_02 = new THREE.PointLight( 0x555555, 0.1, 100 );
light_02.position.set( -50, 50, 50 );
scene.add( light_02 );

var light_03 = new THREE.PointLight( 0x555555, 0.1, 100 );
light_03.position.set( -50, 50, -50 );
scene.add( light_03 );

var light_mouse = new THREE.PointLight( 0x333333, 0.1, 100 );
scene.add( light_mouse );

//////////////////////////////////////////////////////////////////////////////////
//		Logo Image
//////////////////////////////////////////////////////////////////////////////////

var image = 'logo_white_outline.png';
var loader = new THREE.TextureLoader();
loader.load( image, function(texture) {
  // 1728 × 908
  var geometry = new THREE.PlaneGeometry(0.5, 0.5/1.904761905);
  var material = new THREE.MeshBasicMaterial({map: texture, overdraw: 0.5, transparent: true});
  var mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = 1;
  mesh.position.y = 1.1;
  mesh.position.z = 2;
  scene.add(mesh);
});

//////////////////////////////////////////////////////////////////////////////////
//		generate the elements
//////////////////////////////////////////////////////////////////////////////////

function generateElement(i) {
  // find the array index of this game in order to access its colors

  console.log('index: ' + index);

  if ( index != null ) {
    // set the radius of the object
    var radiusFactor = numShards.map(0,100,0.4,0.0001);
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
    var r = games[index].r;
    var g = games[index].g;
    var b = games[index].b;
    var shardColor = new THREE.Color(r, g, b);


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

    var pos_x = Math.random() + 0.5;
    var pos_y = Math.random() * 0.5 + 0.75;
    var pos_z = Math.random() * 0.5 + 1;

    shard_mesh.position.set( pos_x, pos_y, pos_z );

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

// render the scene
onRenderFcts.push(function(){
  // only render the scene, when it is inside the viewport
  if(logoContainer.scrollTop+logo_height >= document.body.scrollTop) {

    rotateShards();

    // move one light with the mouse position
    light_mouse.position.set( mouse_x_pos.map(0,window.innerWidth,-50,50), mouse_y_pos.map(0,window.innerHeight,50,-50), 80 );

    renderer.render( scene, camera );

  }
})

// append the canvas element to the 'logoContainer' DOM element
var rendererDomElement = renderer.domElement;
logoContainer.appendChild(rendererDomElement);

// run the rendering loop
var lastTimeMsec= null
requestAnimationFrame(function animate(nowMsec){
  // keep looping
  requestAnimationFrame( animate );
  // measure time
  lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
  var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
  lastTimeMsec	= nowMsec
  // call each update function
  onRenderFcts.forEach(function(onRenderFct){
    onRenderFct(deltaMsec/1000, nowMsec/1000)
  })
});

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
