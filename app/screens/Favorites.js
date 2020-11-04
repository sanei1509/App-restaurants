import React, { useState, useRef, useCallback } from "react";
import {StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { size } from "lodash";
import Loading from "../components/Loading.js";
import { Image, Icon, Button } from "react-native-elements";
import { useFocusEffect} from "@react-navigation/native";
import Toast from "react-native-easy-toast";

import { firebaseApp } from "../utils/firebase"
import firebase from "firebase";
import "firebase/firestore"; 

const db = firebase.firestore(firebaseApp);
   
export default function Favorites(props){
    const { navigation } = props;
    const [ restaurants, setRestaurants ] = useState(null);
    const [ userLogged, setUserLogged ] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [reloadData, setReloadData] = useState(false);
    const toastRef = useRef();
    
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
            setReloadData(false);
        },[ userLogged, reloadData ])
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
        <View style={styles.viewBody}>
        {restaurants ? (
            <FlatList 
                data={restaurants}
                renderItem={(restaurant) => 
                            <Restaurant 
                                restaurant={restaurant} 
                                setIsLoading={setIsLoading}
                                toastRef={toastRef}
                                setReloadData={setReloadData}    
                                navigation={navigation}
                            />
                        }
                keyExtractor={(item, index) => index.toString()}                 
            />
        ) :(
         <View style={styles.loaderRestaurants}>
         <ActivityIndicator size={50} color="#f00" style={{marginTop: 5, padding: 5 }}/>
         <Text style={{ textAlign: "center", color: "#0b0b0b", padding: 3 ,margin: 10, fontSize:17, fontWeight: "bold",fontStyle: "italic" }}>Cargando lista..</Text>
        </View>
        )}
        <Toast ref={toastRef} position="center" style={{backgroundColor: "#900"}} opacity={0.95} />
        <Loading text="Eliminando" isVisible={isLoading} />
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
                size={40}
            />
            <Text style={{ marginTop: -100,fontWeight:"bold", fontSize: 17, color: "#f90f", textAlign: "center", width: "90%",}}>No tienes restaurantes añadidos aún...</Text>
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
                titleStyle={{fontStyle: "italic",fontWeight: "bold",}}
                title="Ir a iniciar sesión"
                containerStyle={{marginTop: 400, width: "80%", height: 20,}}
                buttonStyle={styles.btnGotoLogin}
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

function Restaurant(props) {
    const { restaurant, setIsLoading, toastRef, setReloadData, navigation, } = props;
    const { id ,name, images } = restaurant.item;

    const confirmRemoveFavorite = () => {
        Alert.alert(
            "Eliminar",
            "¿Quieres elminar este restaurante de tu lista?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    onPress: removeFavorite
                }
              ],
              { cancelable: false }
            )
    }

    const removeFavorite = () => {
        setIsLoading(true);
        db.collection('favorites')
        .where("idRestaurant", "==" , id)
        .where("idUser", "==", firebase.auth().currentUser.uid )
        .get()
        .then((response) => {
            response.forEach( (doc)=> {
               const idFavorite = doc.id;
               db.collection("favorites")
               .doc(idFavorite)
               .delete()
               .then(() => {
                   setIsLoading(false);
                   setReloadData(true);
                   toastRef.current.show("Eliminado!",1500);
               })
               .catch(() => {
                   setIsLoading(false);
                    toastRef.current.show("Algo salió mal, vuelve a intentarlo", 3000);
                })
            })
        })
    }

    return(
        <View style={styles.favoriteRestaurants}>
            <TouchableOpacity 
                onPress={() => navigation.navigate('restaurants',{screen: "restaurant", params: { id } })}
                                        activeOpacity={.95}
                                        >
                <Image  
                    resizeMode="cover" 
                    style={styles.imageRestaurant}
                    PlaceholderContent={
                    <ActivityIndicator size="large" 
                    />}
                    source={
                        images[0] ? { uri: images[0]} 
                                      :  require('../../assets/img/no-image.png')}
                />
                <View style={styles.infoFavoriteRestaurant}>
                    <Text style={styles.name}>{name}</Text>
                    <Icon 
                        type="material-community"
                        name="heart"
                        color="#f00950"
                        activeOpacity={.3}
                        // containerStyle={styles.favorites}
                        onPress={confirmRemoveFavorite}
                        underlayColor={'transparent'}
                        containerStyle={{ justifyContent: "center" ,width: 46, height: 46, elevation: 5, borderRadius: 28, marginBottom: 3, backgroundColor: 'rgba(255,255,255,1)'}}
                    />
                </View>
            </TouchableOpacity>
            
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#f2f2f2", 
        // alignItems: "center",
    },
    loaderRestaurants: {
        marginTop: 10,
        marginBottom: 20,
     },
     btnGotoLogin:{
       backgroundColor: "#0b0b0b", 
       borderRadius: 7,
     },
     favoriteRestaurants:{
        // alignItems: "center",
        // justifyContent: "center",
        margin: 10,
     },
     imageRestaurant: {
        width: "100%",
        height: 180,
     },
     infoFavoriteRestaurant: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: -30,
        backgroundColor: "#fff",
        elevation: 2, 
     },
     name: {
         fontWeight: "bold",
         fontSize: 20,
         fontStyle: "italic",
     },
    //  favorites: {
    //     marginTop: -35,
    //     backgroundColor: "#fff",
    //     padding: 15,
    //     borderRadius: 100,
    //  },
})
    

    


