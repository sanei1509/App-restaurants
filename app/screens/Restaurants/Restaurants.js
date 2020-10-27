import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import ListRestaurants from "../../components/Restaurants/ListRestaurants";
import { TouchableOpacityComponent } from 'react-native';

const db = firebase.firestore(firebaseApp);

export default function Restaurants(props) {
    const { navigation } = props
    const [user, setUser] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [totalRestaurants, setTotalRestaurants] = useState(0);
    const [startRestaurants, setStartRestaurants] = useState(null);
    const [loading, setLoading] = useState(false);
    const limitRestaurant = 10;

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
            setUser(userInfo);
        });
    }, []);

    useFocusEffect(
        useCallback(() => {
            db.collection("restaurants")
            .get()
            .then((snap) => {
                setTotalRestaurants(snap.size)
            });
        const resultRestaurants = [];

        db.collection("restaurants")
            .orderBy("createAt", "desc")
            .limit(limitRestaurant)
            .get()
            .then((response) => {
                setStartRestaurants(response.docs[response.docs.length - 1]);

                response.forEach((doc) => {
                    const restaurant = doc.data();
                    restaurant.id = doc.id;
                    resultRestaurants.push(restaurant);
                });
                setRestaurants(resultRestaurants);
            });
        }, [])
    );


    const handleLoadMore = () => {
        const resultRestaurants = [];
        restaurants.lenght < totalRestaurants && setLoading(true);

        db.collection("restaurants")
            .orderBy("createAt", "desc")
            .startAfter(startRestaurants.data().createAt)
            .limit(limitRestaurant)
            .get()
            .then((response) => {
                if (response.docs.length > 0) {
                    setStartRestaurants(response.docs[response.docs.length - 1]);
                } else {
                    setLoading(false);
                }

                response.forEach((doc) => {
                    const restaurant = doc.data();
                    restaurant.id = doc.id;
                    resultRestaurants.push(restaurant);
                });

                setRestaurants([...restaurants, ...resultRestaurants]);
            });
    };

    return (
         <View style={styles.viewBody}>
        <ListRestaurants 
            restaurants = { restaurants }
            handleLoadMore = { handleLoadMore }
            loading = { loading }
        /> 
        
        {user && ( 
            <Icon
                 type = "material-community"
                 name = "plus"
                 color = "#00a790"
                 size={30}
                 activeOpacity={.1}
                 containerStyle = { [styles.btnContainer] }
                //  iconStyle = {{,}} 
                 onPress = {() => navigation.navigate("add-restaurants") }
                />
                    )}
        </View>
    );
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#e2e2e2",
    },
    btnContainer: {
        position: "absolute",
        bottom:30,
        right: 25,
        padding: 15,
        width: 60,
        height: 60,
        backgroundColor: "#fff",
        borderRadius: 100,   
        elevation: 10,
    },
    
});