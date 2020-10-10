import React, { useState, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { isEmpty } from "lodash";
import { useNavigation } from "@react-navigation/native";
import * as firebase from "firebase";
import Loading from "../Loading";
import { validateEmail } from "../../utils/validations";  



export default function LoginForm(props) {
  const { toastRef } = props;
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(defaultData());
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
   
  // firebase.auth().onAuthStateChanged((user) => {
  //   user && navigation.navigate('account')
  // });

  const onChange = (e, type) => {
    setFormData({...formData,[type]: e.nativeEvent.text})
  }
  const onSubmit = () => {
      if(isEmpty(formData.email) || isEmpty(formData.password)){
        toastRef.current.show("Esta olvidando completar algo");
      }else if(!validateEmail(formData.email)){
          toastRef.current.show("Correo electrónico no válido");
      }
      else{
        setLoading(true)
        firebase
        .auth()
        .signInWithEmailAndPassword(formData.email, formData.password)
        .then(() => {
            setLoading(false);
            navigation.navigate("account");
        })
        .catch(() =>{
           setLoading(false);
          toastRef.current.show("Alguno de los datos son incorrectos");
        })
      }

  } 

       return(
        <View style={styles.formContainer}>
         <Input
            placeholder="Correo electrónico"
            containerStyle={styles.inputForm} 
            onChange={(e) => onChange(e, "email")}
            rightIcon={
              <Icon
               type="material-community"
               name="gmail"
               iconStyle={styles.iconLogin} 
              />
            }      
         />
         <Input
         placeholder="Contraseña"
         containerStyle={styles.inputForm}
         password={true}
         secureTextEntry={showPassword ? (false):(true)}
          onChange={(e) => onChange(e,"password")}
         rightIcon={
           <Icon 
           type="material-community"
           name={showPassword ? "eye-off" : "eye"}
           iconStyle={styles.iconLogin}
           onPress={() => setShowPassword(!showPassword)}
           />
         }
         />
         <Button 
         titleStyle={styles.btnText}
         title="inciar sesión" 
         containerStyle={styles.btnContainerLogin}
         buttonStyle={styles.btnLogin}
         onPress={ () => onSubmit()}
         TouchableComponent={TouchableOpacity}
         />
         <Loading isVisible={loading} text="Iniciando.."/>
        </View>
    ); 
}
 
function defaultData() {
  return {
    email: "",
    passsword: "", 
  };
}

const styles = StyleSheet.create({
   formContainer: {
       flex: 1,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 30,
   },
     inputForm: {
       width: "100%",
       marginTop: -20,
       marginBottom: 40,
   },
     btnContainerLogin: {
         marginLeft: 0,
         marginTop: 2,
         width: "95%",
     },
     btnLogin: {
         backgroundColor:"#000",
         borderRadius: 10,
         
     },
     iconLogin: {
       color:"#c1c1c1",
       fontSize: 24,
     },
     btnText:{
       color: "#f5f5f5f6",
       fontWeight: "bold",
       fontSize: 18,
     },
});