import React, { useRef } from 'react';
import { StyleSheet, View, ScrollView, Text, Image } from "react-native";
import { Divider } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import LoginForm from "../../components/Account/LoginForm";
import Toast from "react-native-easy-toast";

export default function Login() {
 const toastRef = useRef();

    return (
      <ScrollView>
            <Image
           source={require("../../../assets/img/5-tenedores-letras-icono-logo.png")} 
           resizeMode="center"
           style={styles.logo}
            />
            <View style={styles.viewContainer}> 
                <LoginForm toastRef={toastRef} />
                <CreateAccount/>
            </View>
                
               <Divider style={styles.divider}/>
            <Text>Social Login</Text>
        <Toast ref={toastRef} position="center" opacity={0.95} style={{backgroundColor: "#cf1b1b"}} />
      </ScrollView>

   );
}

  function CreateAccount() {
      const navigation = useNavigation();
       console.log(navigation);

    return (
       <Text style={styles.textRegistrer}>
           ¿Aún no tienes una cuenta?{"  "}
           <Text style={styles.btnRegistrer}
                 onPress={() => navigation.navigate("register")}
           >Registrate aqui
           </Text>
       </Text>
    )
  }

 const styles = StyleSheet.create({
      logo: {
           width: "85%",
           height: 200,
           marginTop: 10,
           marginBottom: 20,
           marginLeft: 30,
        },
      viewContainer: {
          marginRight: 40,
          marginLeft: 40,
        },
      textRegistrer: {
            marginTop: 20,
            marginLeft: 33,
            marginRight: 10,
            fontWeight: "bold",
        },
      btnRegistrer: {
          color: "#00a680",
          fontWeight:"bold",
      },
      divider: {
        backgroundColor: "#00a680",
        margin: 20,
      }


 });