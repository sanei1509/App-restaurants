import React, { useState, useEffect, useCallback, useRef } from "react";
import { StyleSheet, Text, ScrollView, View, Dimensions } from "react-native";
import { Rating, ListItem, Icon } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import Loading from "../../components/Loading";
import Carousel from "../../components/Carousel";
import Map from "../../components/Map";
import { map } from "lodash";
import Toast from "react-native-easy-toast";
import ListFeedback from "../../components/Restaurants/ListFeedback";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);
const screenWidth = Dimensions.get('window').width;

export default function Restaurant(props) {
    const { navigation, route } = props;
    const { id, name } = route.params;
    const [restaurant, setRestaurant] = useState(null);
    const [rating , setRating ] = useState(0); 
    const [ isFavorite, setIsFavorite ] = useState(false);
    const [ userLogged, setUserLogged ] = useState(false);
    const toastRef = useRef();

    navigation.setOptions({ title: name });
   
    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false);
    })

    useFocusEffect(
        useCallback(() => {
          db.collection("restaurants")
            .doc(id)
            .get()
            .then((response) => {
              const data = response.data();
              data.id = response.id;
              setRestaurant(data);
              setRating(data.rating);
            });
        }, [])
      );

      useEffect(()=> {
        if(userLogged && restaurant){
            db.collection('favorites')
            .where("idRestaurant", "==", restaurant.id )
            .where("idUser", "==", firebase.auth().currentUser.uid)
            .get()
            .then((response) => {
                if(response.docs.length == 1){
                    setIsFavorite(true);
                };
            })
        }
      }, [userLogged, restaurant]);

      const addFavorites = () => {
        if(!userLogged){
            toastRef.current.show('Para hacer uso de favoritos debes tener cuenta')
        } else {
            const payload = {
                idUser: firebase.auth().currentUser.uid,
                idRestaurant: restaurant.id
            }
            db.collection('favorites')
            .add(payload)
            .then(()=> {
                setIsFavorite(true);
                toastRef.current.show('Añadido a favoritos');
            })
            .catch(()=> {
                toastRef.current.show('Error, Intentalo de nuevo')
            })
        }
     }
     const deleteFavorites = () => {
       db.collection("favorites")
       .where("idRestaurant", "==", restaurant.id)
       .where("idUser", "==", firebase.auth().currentUser.uid)
       .get()
       .then((response) => {
           response.forEach( (doc) => {
            const idFavorite = doc.id;
            db.collection("favorites")
            .doc(idFavorite)
            .delete()
            .then(()=> {
                setIsFavorite(false);
                toastRef.current.show('Eliminado correctamente')
            })
            .catch(() => {
                toastRef.current.show('Algo salió mal vuelve a intentar.')
            })
           });  
       })
     }
    
    if(!restaurant) return <Loading isVisible={true} text="cargando.."/> ;
        
    return(
        <ScrollView vertical style={styles.viewBody}>
            <View style={styles.viewIconFavorite}>
                <Icon
                    type="material-community"
                    name={ !isFavorite ? "heart-outline" : "heart"}
                    color={ isFavorite ? "#900" : "#000" }
                    onPress={()=> !isFavorite ? addFavorites() : deleteFavorites() }
                    size={!isFavorite ? 28 : 33}
                    underlayColor="transparent"
                />
            </View>
            <Carousel
                arrayImages={restaurant.images}
                height={250}
                width={screenWidth}
            />
            <TitleRestaurant 
                name={restaurant.name}
                description={restaurant.description}
                rating={restaurant.rating}
            />
            <RestaurantInfo
                location={restaurant.location}
                name={restaurant.name}
                address={restaurant.address}
            />
            <ListFeedback 
                navigation={navigation}
                idRestaurant={restaurant.id}
            />
            <Toast 
                ref={toastRef}
                // position="top"
                opacity={0.95}
                style={{backgroundColor: "#f00945"}}
            />
        </ScrollView>
    )
}

function TitleRestaurant(props) {
    const { name, description, rating } = props;
    return(
        <View style={styles.viewRestaurantTitle}>
           <View style={{ flexDirection: "column" }}>
                <Text style={styles.nameRestaurant}>{name}</Text>
            <Rating 
                style={styles.rating}
                imageSize={20}
                readonly
                startingValue={parseFloat(rating)}
            />
                <Text style={styles.descriptionRestaurant}>{description}</Text>
            </View>
        </View>
    );
}

function RestaurantInfo(props) {
    const { location, name, address } = props

    const listInfo =[
           { 
               text: address,
            IconName: "map-marker",
            IconType: "material-community",
            action: null,
        },
        {
            text:' 091-346-784  &  9832-4589 ',
            IconName: "phone-forward",
            IconType: "material-community",
            action: null, 
        },
        {
            text: 'santiagoneira52@gmail.com',
        IconName: "gmail",
        IconType: "material-community",
        action: null,
        },
    ]

    return (
        <View style={styles.viewRestaurantInfo}>
           <Text style={styles.title}>Información sobre el restaurante</Text> 
            <Map location={location} name={name} height={115} />
            {map(listInfo, (item, index) =>(
                <ListItem 
                    titleStyle={{fontSize: 13.5}}
                    style={styles.viewListItems}
                    key={index}
                    title={item.text}
                    leftIcon={{
                        name: item.IconName,
                        type: item.IconType,
                        color: "#00a790",
                        iconStyle:{ fontSize:18.5}
                    }}
                    containerStyle={styles.containerListItem}
                />
            ))}    
        </View>
    )
};

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff",
    },
    viewRestaurantTitle: {
         padding: 15,
         fontSize: 17,
    },
    nameRestaurant: {
        fontSize: 25,
        fontWeight: "bold",
        fontStyle: "italic",
    },
    descriptionRestaurant : {
        marginTop: 5,
        color: "#7a7a7a",
    },
    rating: {
        position: "absolute",
        right: 0,
    },
    viewRestaurantInfo: {
        margin: "auto",
        padding:10,
    },
    title: {
        marginTop: 8,
        marginBottom: 3,
        fontSize: 16,
        fontWeight: "700",
    },
    containerListItem: {
        marginTop:1, 
        padding: 10,
        marginBottom: 5,
    },
    viewIconFavorite: {
    position: 'absolute',
    top: 10,
    right: 10,  
    zIndex: 99,
    backgroundColor: "#f6f6f5",
    padding: 8,
    borderRadius: 50,
    },
});