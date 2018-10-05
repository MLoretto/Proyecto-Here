const listado = document.getElementById('listContent'); 
const distanciaFalta = document.getElementById('distanciaFalta'); 
const arma = document.getElementById('arma');
let selectedMarket;

let caminando = false;
console.log(listado);
/*
$(document).ready(function(){ // Inicializar checkbox
   $('select').formSelect();
 });
*/
//objeto que tiene el listado de los lugares de reciclaje
let ecoPlaces = [
    {id:0125630, position: {lat: -33.4189, lng: -70.6422}, decripcion : "Punto Eco-Go Laboratoria", distancia: 0},
    {id:1896548, position: {lat: -33.4188, lng: -70.6424}, decripcion : "Punto Eco-Go Star", distancia: 0},
    {id:2589635, position: {lat: -33.4180, lng: -70.6433}, decripcion : "Punto Eco-Go Golden", distancia: 0},
    {id:3070586, position: {lat: -33.4194, lng: -70.6405}, decripcion : "Punto Eco-Go Silver", distancia: 0},
    {id:4478514, position: {lat: -33.4170, lng: -70.6405}, decripcion : "Punto Eco-Go Platinum", distancia: 0},
    {id:5896541, position: {lat: -33.4184, lng: -70.6396}, decripcion : "Punto Eco-Go Diamond", distancia: 0}
];

//Paso 1: inicializar la plataforma
platform = new H.service.Platform({
   'app_id': 'xp2LMzBFCMvdU9TNRRjY',
   'app_code': 'w1p60cUN3oTM8VhpR1B0ww',
   useHTTPS: true
});
console.log(window.devicePixelRatio);
let pixelRatio = window.devicePixelRatio || 1;
let defaultLayers = platform.createDefaultLayers({
 tileSize: pixelRatio === 1 ? 256 : 512,
 ppi: pixelRatio === 1 ? undefined : 320
});

//Paso 2: inicializar el mapa, pre configurando un lugar y zoom
let map = new H.Map(document.getElementById('mapContainer'),
 defaultLayers.normal.map,{
 center: {lat: -33.4189088, lng: -70.6422443},
 zoom: 16,
 pixelRatio: pixelRatio
});

/*
// Crea un MapTileService instancia para l(i.e. base.map.api.here.com):
var mapTileService = platform.getMapTileService({ 'type': 'map' });
var fleetStyleLayer = mapTileService.createTileLayer(
 'maptile', 
 'normal.day', 
 256, 
 'png8', 
 { 'style': 'fleet' });
 
// Set the new fleet style layer as a base layer on the map:
map.setBaseLayer(fleetStyleLayer);
*/


//Paso 3: hacer el mapa interactivo
// MapEvents obtener eventos del sistema
// Behavior implementa el pan/zoom 
let behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// crea la interfaces de usuario por defecto en el mapa 
let ui = H.ui.UI.createDefault(map, defaultLayers);

//Sgv del icono de EcoGO
let svgMarkup = 
   '<svg version="1.0" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"' +
   '	 width="48px" height="48px" viewBox="0 0 32 32" enable-background="new 0 0 32 32" xml:space="preserve">' +
   '<g>' +
   '	<path fill="#97B94F" d="M18.333,17.343c0.035-0.494,0.05-0.983,0.049-1.466c-0.507,0.292-1.079,0.49-1.695,0.569' +
   '		c-2.493,0.317-4.773-1.446-5.09-3.94c-0.318-2.494,1.446-4.773,3.94-5.09c0.447-0.058,0.887-0.047,1.311,0.022' +
   '		c-0.433-1.233-0.878-2.247-1.223-2.963C15.473,4.485,15.321,4.5,15.168,4.52c-4.635,0.591-7.914,4.827-7.324,9.462' +
   '		c0.216,1.691,1.676,3.749,3.456,6.286l6.966-2.971L18.333,17.343z"/>' +
   '	<path fill="#D0D647" d="M20.627,11.355c0.239,1.877-0.701,3.632-2.245,4.522c0.001,0.483-0.015,0.972-0.049,1.466l4.587,3.116' +
   '		c2.043-3.99,1.942-6.789,1.709-8.616c-0.571-4.482-4.551-7.696-9.005-7.369c0.344,0.716,0.79,1.73,1.223,2.963' +
   '		C18.785,7.754,20.367,9.309,20.627,11.355z"/>' +
   '	<path fill="#6CA753" d="M17.822,20.591c0.275-1.092,0.438-2.181,0.512-3.249l-0.067-0.046L11.3,20.268' +
   '		c0.235,0.334,0.475,0.676,0.718,1.027c0.524,0.755,0.823,1.567,0.962,2.394l4.809-3.129L17.822,20.591z"/>' +
   '	<path fill="#508B4A" d="M17.398,22.018c-1.072,3.11-6.645,9.697-6.645,9.697s7.214-3.827,10.178-8.004l-3.109-3.12' +
   '		C17.702,21.066,17.562,21.543,17.398,22.018z"/>' +
   '	<path fill="#97B94F" d="M22.92,20.458l-4.587-3.116c-0.074,1.068-0.237,2.156-0.512,3.249l3.109,3.12' +
   '		c0.006-0.009,0.014-0.019,0.021-0.029C21.763,22.531,22.409,21.458,22.92,20.458z"/>' +
   '	<path fill="#D0D647" d="M17.398,22.018c0.164-0.475,0.304-0.952,0.424-1.427L17.79,20.56l-4.809,3.129' +
   '		c0.648,3.864-2.228,8.027-2.228,8.027S16.326,25.128,17.398,22.018z"/>' +
   '</g>' +
   '<path fill="#97B94F" d="M15.502,4.474c0,0-0.933,0.187-1.283-1.124c-0.35-1.312,1.147-3.018,1.147-3.018S12.224,1.8,13.001,3.309' +
   '	c0.777,1.509,0.598,2.193,0.598,2.193L15.502,4.474z"/>' +
   '</svg>';

//Crea el icono de tipo map.icon con el sgv de ecoGo
let iconoEcoGo = new H.map.Icon(svgMarkup);

//crea una marca con la posicion indicada
let markerUser = new H.map.Marker({ lat: -33.4189088, lng: -70.6422443 });//, { icon: iconoEcoGo });
map.addObject(markerUser);
let radioAccion = new H.map.Circle(
    // Centro del circulo
    { lat: -33.4189088, lng: -70.6422443 },
    // radio del circulo en metros
    250,
    {
      style: {
        strokeColor: 'rgba(55, 85, 170, 0)', // color de la orilla del circulo
        lineWidth: 0, //ancho de la orilla
        fillColor: 'rgba(255,255,191, 0.4)'  // color de fondo del circulo
      }
    }
  );
map.addObject(radioAccion);




listado.innerHTML = '';
//Coloca las marcas de cada uno de los lugares de reciclaje
ecoPlaces.forEach(function(ecoMarker) {
 let markerUser = new H.map.Marker(ecoMarker.position, { icon: iconoEcoGo });
 ecoMarker["marca"] = markerUser;
 map.addObject(markerUser);

 addLugares(ecoMarker)
});
/*
items.sort(function (a, b) {
 return (a.perc - b.perc)
})
*/
function ordenarLugares(){
 listado.innerHTML = '';
 ecoPlaces.sort(function (a, b) {
   return (a.distancia - b.distancia)

 }).forEach(function(ecoMarker) {
 
   addLugares(ecoMarker)
 });

}

function convertTo(data) {
    if(data > 999){
        return (data / 1000).toFixed(1) + ' km'; 
    }
    else{
        return data + ' mts';
    }
}


function addLugares(ecoMarker){
 listado.innerHTML += 
 '<div class="row">' +
 '  <div class="col s12 m6">' +
 '    <div class="card colorTarjeta">' +
 '      <div class="card-content white-text">' +
 '        <span class="card-title">' + ecoMarker.decripcion +'</span> <!-- Titulo puntos eco-go-->' +
 '        <p class="colorP">'+ convertTo(ecoMarker.distancia.toFixed(0)) +'</p>' +
 '      </div>' +
 '      <div class="card-action right-align">' +
 '          <button id="irPunto" type="button" class="btn-floating btn waves-effect waves-light right-align" onclick="goRute(' + ecoMarker.id + ')">IR</i></button>' +
 '      </div>' +
 '    </div>' +
 '  </div>' +
 '</div> '; 
}

//Actualiza el mapa con la posicion actual cada 1 segundo.
function updaeteLocation(position) {
   map.setCenter({lat:position.coords.latitude, lng:position.coords.longitude});//centra el mapa en la posicion del usuario
   markerUser.setPosition({lat:position.coords.latitude, lng:position.coords.longitude});//centra la marca en la posicion del usuario
   radioAccion.setCenter({lat:position.coords.latitude, lng:position.coords.longitude});//centra el circulo en la posicion del usuario

   if(caminando === false){
    ecoPlaces.forEach(function(ecoMarker) {
        let distancia = ecoMarker.marca.getPosition().distance({lat:position.coords.latitude, lng:position.coords.longitude});
        ecoMarker.distancia = distancia;
        //console.log( ecoMarker);
      });
      ordenarLugares();
   
   }else{
    let distancia = selectedMarket.marca.getPosition().distance({lat:position.coords.latitude, lng:position.coords.longitude});
    radioAccion.setRadius(distancia);
    distanciaFalta.innerHTML = distancia.toFixed(0) + ' mts';
    
   }
}
//si hay algun error al geolocalizar se ejcuta
function errorLocation(error){
 console.log(error);
}

optionsGPS = {
 enableHighAccuracy: true,
 timeout: 5000,
 maximumAge: 0
};


if ('geolocation' in navigator) {
   navigator.geolocation.getCurrentPosition(function (location) {
     updaeteLocation(location);
   },errorLocation, optionsGPS);
   watchId = navigator.geolocation.watchPosition(updaeteLocation, errorLocation, optionsGPS);
} else {
 console.log('Geolocation API not supported.');
}


//evento click del raton para poder hacer la ubicacion de los puntos ecologicos.
map.addEventListener('tap', function (evt) {
   let coord = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
   console.log('pinchaste en  lat:' + coord.lat.toFixed(4) + ' , lng:' + coord.lng.toFixed(4));
});

//obtiene la ruta del identificador asociado
function goRute(id){
    let ecoFound = ecoPlaces.find(function(ecoMarker) {
        return ecoMarker.id === id;
    });
    selectedMarket = ecoFound;
    caminando = true;
    showRoute(ecoFound);
    listado.style.display = 'none';
    let qrContent =document.getElementById("qrContent");
    qrContent.style.display = 'block';
}

//consulta la ruta y crea la linea (proximamente)
function showRoute(ecoFound){

 let routingParameters = {
   // el modo de ir por la ruta:
   'mode': 'fastest;pedestrian',//'fastest;car',
   // punto de inicio de la ruta:
   'waypoint0': 'geo!' + markerUser.getPosition().lat + ',' + markerUser.getPosition().lng,
   // punto final de la ruta:
   'waypoint1': 'geo!' + ecoFound.position.lat + ',' + ecoFound.position.lng,
   'representation': 'display'
 };

 var onResult = function (result) {
   var route,
       routeShape,
       startPoint,
       endPoint,
       linestring;
   if (result.response.route) {
       // Pick the first route from the response:
       route = result.response.route[0];
       // Pick the route's shape:
       routeShape = route.shape;

       // Create a linestring to use as a point source for the route line
       linestring = new H.geo.LineString();

       // Push all the points in the shape into the linestring:
       routeShape.forEach(function (point) {
           var parts = point.split(',');
           linestring.pushLatLngAlt(parts[0], parts[1]);
       });

       var routeLine = new H.map.Polyline(linestring, {
           style: { strokeColor: 'green', lineWidth: 5 }
       });
      // Add the route polyline and the two markers to the map:
       map.addObjects([routeLine]);
       // Set the map's viewport to make the whole route visible:
       map.setViewBounds(routeLine.getBounds());
       watchId = navigator.geolocation.watchPosition(updaeteLocation, errorLocation, optionsGPS);
   }
 };

 var router = platform.getRoutingService();

 // Call calculateRoute() with the routing parameters,
 // the callback and an error callback function (called if a
 // communication error occurs):
 router.calculateRoute(routingParameters, onResult,
     function (error) {
         console.log(error.message);
     });


}
function qrGo(){
    if(arma.value === ''){
        alert('debes selecionar un arma.');
    }else{
        localStorage.setItem("distancia", selectedMarket.distancia); 
        localStorage.setItem("selectId", selectedMarket.id); 
        localStorage.setItem("selectArma",arma.value);
        window.location = "../html/qrlector.html"
    }
}
