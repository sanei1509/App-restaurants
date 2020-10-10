import React, { useRef } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-easy-toast";

import RegisterForm from "../../../app/components/Account/RegisterForm";


 export default function Register() {
    const toastRef = useRef(); 
    
   
    return (
      <KeyboardAwareScrollView>
           <Image
           source={require("../../../assets/img/5-tenedores-letras-icono-logo.png")}
           resizeMode= "center"
           style={styles.logo}
           />
           <View style={styles.viewForm}>
                <RegisterForm toastRef={toastRef} />
           </View>    
           <Toast ref={toastRef} position="center" opacity={0.9} style={{backgroundColor: '#cf1b1b'}} /> 
      </KeyboardAwareScrollView>
   );

 }

 const styles = StyleSheet.create({
   logo: {
     width: "85%",
     height: 200,
     marginTop: 10,
     marginBottom: 10,
     marginLeft: 30,
   },
   viewForm: {
     marginRight: 40,
     marginLeft: 40,
   }

 });       

