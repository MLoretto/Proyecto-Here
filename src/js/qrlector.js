const scanner = new Instascan.Scanner({
  video: document.getElementById('webcam')
});
let ecoPlaces = [
    {id:'0125630', position: {lat: -33.4189, lng: -70.6422}, decripcion : "Punto Eco-Go Laboratoria", distancia: 0},
    {id:'1896548', position: {lat: -33.4188, lng: -70.6424}, decripcion : "Punto Eco-Go Star", distancia: 0},
    {id:'2589635', position: {lat: -33.4180, lng: -70.6433}, decripcion : "Punto Eco-Go Golden", distancia: 0},
    {id:'3070586', position: {lat: -33.4194, lng: -70.6405}, decripcion : "Punto Eco-Go Silver", distancia: 0},
    {id:'4478514', position: {lat: -33.4170, lng: -70.6405}, decripcion : "Punto Eco-Go Platinum", distancia: 0},
    {id:'5896541', position: {lat: -33.4184, lng: -70.6396}, decripcion : "Punto Eco-Go Diamond", distancia: 0}
];

scanner.addListener('scan', content => {
    let ecoFound = ecoPlaces.find(function(ecoMarker) {
        return ecoMarker.id === content;
    });
    console.log(content);
    console.log(ecoFound);
    if(ecoFound === undefined){
        alert('UPS!!! Ese código QR no es de un Punto Eco-Go!!!');
    }else{
        if(content === localStorage.getItem("selectId")){
            localStorage.setItem("selectQR",content);
            window.location = "../html/picture.html";
        }else{
            alert('UPS!!! Ese código QR no es de un Punto Eco-Go que elejiste al principio!!!');
        }
    }

});
Instascan.Camera.getCameras().then( cameras => {
    if(cameras.length > 0){
        for (let index = 0; index < cameras.length; index++) {
            console.log(cameras[index]);
        }  
        scanner.start(cameras[0]);
   }
});