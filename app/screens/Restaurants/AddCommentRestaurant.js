import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { AirbnbRating, Button, Input } from "react-native-elements";
import Toast from "react-native-easy-toast";
import { TouchableOpacity } from "react-native-gesture-handler";
import Loading from "../../components/Loading";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function AddCommentRestaurant(props){
    const { route, navigation } = props;
    const { idRestaurant } = route.params;
    const [ rating, setRating ] = useState(null);
    const [ title, setTitle ] = useState("");
    const [ comment, setComment ] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const toastRef = useRef();

    const addComment = () => {
      if(!rating){
        toastRef.current.show("Estas olvidando dejar tu puntuación");
      } else if(!title){
        toastRef.current.show("Debes darle un título a tu comentario");
      } else if(!comment){
        toastRef.current.show("Estas dejando la caja de comentario vacía");
      } else {
          setIsLoading(true);
          const user = firebase.auth().currentUser;
          const payload = {
              idUser: user.uid,
              avatarUser: user.photoURL,
              idRestaurant: idRestaurant,
              title: title,
              comment: comment,
              rating: rating,
              createAt: new Date(),
          };
          
          db.collection("comments")
          .add(payload)
          .then(() => {
            updateRestaurant()
          })
          .catch(() => {
              toastRef.current.show("Hubó un problema intentalo nuevamente");
              setIsLoading(false);
          });
      }
    };

    const updateRestaurant = () => {
      const restaurantRef = db.collection("restaurants").doc(idRestaurant);
        
      restaurantRef.get().then((response) => {
        const restaurantData = response.data();
        const ratingTotal = restaurantData.ratingTotal + rating;
        const quantityVoting = restaurantData.quantityVoting + 1;
        const ratingResult = ratingTotal / quantityVoting;
  
        restaurantRef
        .update({
          rating: ratingResult,
          ratingTotal,
          quantityVoting,
        })
        .then(() => {
          setIsLoading(false);
          navigation.goBack();
        });
    });
  };

    return(
        <View style={styles.viewBody}>
            <View style={styles.viewRating} >
            <AirbnbRating
            size={20}
            count={5}
            reviews={["Muy Malo", "Deficiente", "Normal", "Muy bueno", "Excelente!"]}
            defaultRating={0}  
            onFinishRating={(value) => { setRating(value) }}  
            />
            </View>
            <View style={styles.formReview}>
                <Input 
                    placeholder="Título"
                    containerStyle={styles.input}
                    inputContainerStyle={styles.borderInput}
                    onChange={(e) => setTitle(e.nativeEvent.text)}
                />
                <Input
                    placeholder="Agregar comentario.."
                    multiline={true}
                    inputContainerStyle={styles.textArea}
                    onChange={(e) => setComment(e.nativeEvent.text)}
                    clearTextOnFocus
               />
                <Button 
                    title="Enviar comentario"
                    containerStyle={styles.btnSendContainer}
                    buttonStyle={styles.btnSend}
                    onPress={addComment}
                    TouchableComponent={TouchableOpacity}
                />
            </View>
            <Toast ref={toastRef} position="center" opacity={0.9} style={{backgroundColor:"#900"}} />
            <Loading isVisible={isLoading} text="Enviando.." />
        </View>
    );
}


const styles = StyleSheet.create({
    viewBody: {
        // backgroundColor: "#7a7a7a",
        flex: 1,
    },
    viewRating: {
        height: 100,
        backgroundColor: '#f2f2f2'
    },
    formReview: {
        flex: 1 ,
        alignItems: "center",
        margin: 10,
        marginTop: 20,
    },
    input: {
        marginBottom: 20,
    },
    borderInput:{
        padding: 5,
        borderWidth: 0.5,
        borderColor: "#0278ae",
    },
    textArea: {
        borderWidth: 0.5,
        borderColor: "#0278ae",
        paddingBottom: 30,
        paddingLeft: 5,
        paddingRight: 5,
    },
    btnSendContainer: {
        flex: 1,
        justifyContent: "flex-end",
        marginBottom: 10,
        width: "93%",
    },
    btnSend: {
        backgroundColor: "#00a790",
        padding: 9,
    },

})