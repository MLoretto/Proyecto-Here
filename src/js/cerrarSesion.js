function cerrarSesion(){
    firebase.auth().signOut()
    .then(function(){
      console.log('Cerrando sesión....');
      window.location='index.html'
    })
    .catch(function(error){
      console.log(error);
    })
  }