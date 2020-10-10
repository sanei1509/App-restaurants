import React, { useState, useRef } from "react";
import { StyleSheet, View, Text } from "react-native";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";
import AddRestaurantsForm from "../../components/Restaurants/AddRestaurantsForm";

export default function AddRestaurants(props) {
    const { navigation } = props;
    const [ isLoading, setIsLoading ] = useState(false);
    const toastRef = useRef();
    return(
        <View>
            <AddRestaurantsForm 
                toastRef={toastRef}
                navigation={navigation}
                setIsLoading={setIsLoading}
            />
            <Toast ref={toastRef} position="center" opacity={0.95} style={{backgroundColor:"#900"}} />
            <Loading isVisible={isLoading} text="Añadiendo..." />
        </View>
    );
}

const styles = StyleSheet.create({

});