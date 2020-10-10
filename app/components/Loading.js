import React from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { Overlay } from "react-native-elements";

export default function Loading(props) {
  const { isVisible, text } = props;

  return (
   <Overlay 
       isVisible = {isVisible}
       windowBackgroundColor = "rgba(0, 0, 0, 0.4)"
       overlayBackgroundColor = "transparent"
       overlayStyle = {styles.overlay}
    >  

     <View style={styles.view}>
            <ActivityIndicator size="large" color="#00a680" />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
   </Overlay>
  );
}

   //Declarando los STYLESHEETS.

    const styles = StyleSheet.create({
        overlay: {
            height: 100,
            width: 200,
            backgroundColor: "#fff",
            borderColor: "#00a680",
            borderWidth: 2,
            borderRadius: 10,
            opacity: 0.5,
        },
        view: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
        },
        text: {
            fontSize: 15,
            color: "#242424",
            textTransform:"uppercase" ,
            marginTop: 10,
        }
    });
