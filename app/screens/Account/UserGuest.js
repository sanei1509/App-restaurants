
// ESTA ES LA SCREEN DE LOS USUARIOS QUE NO ESTAN LOGUEADOS ('INVITADOS')
import React from "react";
import { StyleSheet, View, ScrollView, Text, Image } from "react-native";
import { Button } from "react-native-elements";
import {useNavigation} from "@react-navigation/native";

export default function UserGuest() {
   const navigation = useNavigation();
   console.log(navigation);

   return (
     <ScrollView centerContent={true} style={styles.viewBody}>
          <Image
              source={require("../../../assets/img/user-guest.jpg")} 
                resizeMode="contain"
                style={styles.image}
          />
          <Text style={styles.title}>Consulta tu perfil de la App</Text>
          <Text style={styles.description}>
            ¿Que es lo que buscas en un restaurante?  Busca y visualiza restaurantes de forma rápida y sencilla, vota cual te ha convencido más,  por último comenta como fue tu experiencia con la App.      
          </Text>
          <View style={styles.viewBtn}>
            <Button
              title="Ir a mi perfil"
              buttonStyle={styles.btnStyle}
              containeStyle={styles.btnContainer}
              onPress={() => navigation.navigate("login")}
            />
          </View>
     </ScrollView>
   );
     
}

 const styles = StyleSheet.create({
     viewBody: {
       marginLeft: 30,
       marginRight: 30,
     },
    image: {
      height: 500,
      width: "100%",
      marginBottom:-50,
    },
    title: {
      fontWeight: "bold",
      fontSize: 25,
      marginBottom: 10,
      textAlign: "center",
    },
    description: {
      textAlign: "center",
      marginBottom: 10,
    },
    viewBtn:{
      flex: 1,
      alignItems: "center",
    },
    btnStyle: {
      backgroundColor: "#00a680",
    },
    btnContainer: {
       width: "%87",
    },
    

 });
