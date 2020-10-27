import React, {useState, useEffect, useRef } from "react";
import { View, Text} from "react-native";
import Toast from "react-native-easy-toast";
import ListTopRestaurants from "../components/Ranking/ListTopRestaurants";

import { firebaseApp } from "../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function TopRestaurants(props) {
    const { navigation } = props;
    const [ favoriteRestaurants, setFavoriteRestaurants ] = useState([]);
    const { toastRef } = useRef();

    useEffect(() => {
        db.collection('restaurants')
        .orderBy("rating")
        .limit(5)
        .get()
        .then((response) => {
            const restaurantArray = [];
            response.forEach((doc) => {
                const data = doc.data();
                data.id = doc.id;
                restaurantArray.push(data);
            });
            setFavoriteRestaurants(restaurantArray);
        });
    }, []);

    return(
<View>
    <ListTopRestaurants favoriteRestaurants={favoriteRestaurants} navigation={navigation} />
        <Toast ref={toastRef} position="center" opacity={0.95} />
</View>
    );
}