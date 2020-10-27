import React from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { Overlay } from "react-native-elements";

export default function Loading(props) {
  const { isVisible, text } = props;

  return (
   <Overlay 
       isVisible = {isVisible}
       windowBackgroundColor = "rgba(0, 0, 0, 0.0001)"
       overlayBackgroundColor = "transparent"
       overlayStyle = {styles.overlay}
    >  

     <View style={styles.view}>
            <ActivityIndicator size={60} color="#f00"/>
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
   </Overlay>
  );
}

   //Declarando los STYLESHEETS.

    const styles = StyleSheet.create({
        overlay: {
            height: 1000,
            width: 1000,
            backgroundColor: "transparent",
            // borderColor: "#00a680",
            // borderWidth: 2,
            // borderRadius: 1,
            opacity: 2,
        },
        view: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
        },
        text: {
            fontSize: 19,
            fontStyle: "italic",
            fontWeight: "bold",
            color: "#000",
            // textTransform:"uppercase" ,
            marginTop: 10,
        }
    });
