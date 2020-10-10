import React, { useState, useEffect } from "react";
import * as firebase from "firebase"; 
import Loading from "../../components/Loading";
import UserGuest from "./UserGuest";
import UserLogged from "./UserLogged";


export default function Account() {
  const [login, setLogin] = useState(null);
 
   useEffect(() => {
       firebase.auth().onAuthStateChanged ((user) => {
/* siUserEsNullEntonces esto  */!user ? setLogin(false) : setLogin(true);
   });
   }, []); //este ARRAY SIRVE PARA : cuando a un estado sea modificado o alguna variabla , no se siga ejecutando como un bucle.

 if (login === null) return <Loading isVisible={true} text="Cargando..." />; 
//<= <Text>Cargando...</Text>;=> este texto lo sustituimos por nuestro componente -- Arriba
    return login ? <UserLogged /> : <UserGuest />;
  // ? si login es true sifnifica que el usuario esta logueado ya entonces renderizamos el componente correspondiente.
  // : por el contrario si el usuario no esta logueado vamos a renderizar el otro componenente de invitado.

  /* if(login) {
    return <UserLogged />
  }else{
    return <UserGuest />
  } */        // este codigo sería lo mismo que lo de la línea 22.
  

}