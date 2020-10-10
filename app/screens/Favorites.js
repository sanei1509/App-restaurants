import React, { useState, useRef, useCallback } from "react";
import {StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert, } from "react-native";
import { size } from "lodash";
import Loading from "../components/Loading.js";
import { Image, Icon, Button } from "react-native-elements";
import { useFocusEffect} from "@react-navigation/native";

import { firebaseApp } from "../utils/firebase"
import firebase from "firebase";
import "firebase/firestore"; 

const db = firebase.firestore(firebaseApp);
   
export default function Favorites(props){
    const { navigation } = props;
    const [ restaurants, setRestaurants ] = useState(null);
    const [ userLogged, setUserLogged ] = useState(false);
    
    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false);
    });

    useFocusEffect(
        useCallback(() => {
            if (userLogged){
                const idUser = firebase.auth().currentUser.uid;
                db.collection("favorites")
                .where("idUser", "==", idUser)
                .get()
                .then((response)=> {
                    const idRestaurantsArray = [];
                    response.forEach((doc) => {
                        idRestaurantsArray.push(doc.data().idRestaurant);
                    });
                    getDataRestaurant(idRestaurantsArray).then((response) => {
                        const restaurants = [];
                        response.forEach((doc) => {
                            const restaurant = doc.data();
                            restaurant.id = doc.id;
                            restaurants.push(restaurant);
                        });
                        setRestaurants(restaurants);
                    });
                });
                
            }
        },[ userLogged ])
    );

        

    const getDataRestaurant = (idRestaurantsArray) => {
        const arrayRestaurants = [];
        idRestaurantsArray.forEach((idRestaurant) => {
            const result = db.collection("restaurants").doc(idRestaurant).get();
            arrayRestaurants.push(result);
        })
        return Promise.all(arrayRestaurants);
    };

    if(!userLogged){
        return(
            <View>
                <UserNoLogged  navigation={navigation} />
            </View>
        )
    }

    
    if (restaurants?.length === 0) {
        return <NotFoundRestaurants />;
      }
   
    return(
        <View>
         <Text>Favorites...</Text>
        </View>
    );
}
    
function NotFoundRestaurants(){
    return(
        <View style={{flex: 1, alignItems: "center", justifyContent: "center",}}>
            <Icon 
                type="material-community"
                name="alert-outline"
                color="#f00940"   
            />
            <Text>No tienes restaurantes añadidos aún...</Text>
        </View>
    );
}
   
function UserNoLogged(props){
    const {navigation} = props;

    return(
        <View style={{flex:1 ,alignItems: "center", justifyContent: "center"}}>
            {/* <Icon 
                type="material-community"
                name="alert-outline"
                color="#f00940"   
            /> */}
            {/* <Text style={{fontWeight:"bold", fontSize: 19, color: "#f00940", textAlign: "center"}} > Necesitas tener cuenta para hacer uso de esta lista</Text> */}
            <Button 
                title="Ir al login"
                containerStyle={{marginTop: 400, width: "80%", height: 20,}}
                buttonStyle={{ color: "#00a790", backgroundColor: "#0b0b0b", borderRadius: 10,}}
                onPress={() => navigation.navigate('account',{screen: "login"})}
                TouchableComponent={TouchableOpacity}
           />
           
            <Text style={{ marginTop: -100,fontWeight:"bold", fontSize: 17, color: "#f90f", textAlign: "center", width: "90%",}} > Necesitas tener cuenta para hacer uso de esta lista</Text>
        <Text>                       </Text>
            <Icon 
                type="material-community"
                name="alert-outline"
                color="#f00940"   
                iconStyle={{paddingTop: 20,}}
                size={50}
            />
        </View>
    )
}

    

    


