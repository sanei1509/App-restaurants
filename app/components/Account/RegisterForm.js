import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import Loading from "../Loading";
import { size, isEmpty } from "lodash";
import * as firebase from "firebase";
import { useNavigation } from "@react-navigation/native"; 
import { validateEmail } from "../../utils/validations";

  export default function RegisterForm(props) {
    const {toastRef} = props; 
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [formData, setFormData] = useState(defaultFormValue());
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

     const onSubmit = () => {
       
        if(isEmpty(formData.email) ||
        isEmpty(formData.password) ||
        isEmpty(formData.repeatPassword)){

          // console.log("Todos los campos son obligatorios");
          toastRef.current.show("Todos los campos son obligatorios");
        }else if(!validateEmail(formData.email)){
              // console.log("El email no es válido");
          toastRef.current.show("Correo electrónico no válido");
        }
        else if(formData.password !== formData.repeatPassword){
          // console.log("las contraseñas no coinciden vuelva a intentarlo");
          toastRef.current.show("Las claves no coinciden vuelva a intentarlo");
        }
        else if(size(formData.password) < 6) {
          // console.log("Su clave debe tener 6 caracteres como minimo");
          toastRef.current.show("*Su clave debe tener 6 caracteres como mínimo");
        }
         else {
           setLoading(true);
          // console.log("todo okey");
          // toastRef.current.show("enviando..");
          firebase.auth()
          .createUserWithEmailAndPassword(formData.email, formData.password)
          .then(() => {
              setLoading(false);
            navigation.navigate("account");
            })
            .catch(() =>{
              setLoading(false);
              toastRef.current.show("Este correo eléctronico ya esta en uso");
            });
          
        }
        
     };
     const onChange = (e, type) => {
         // console.log(type);}
        // console.log(e.nativeEvent.text);
     // setFormData({ [type]: e.nativeEvent.text});
     setFormData({ ...formData, [type]: e.nativeEvent.text});
     };

       return (
          <View style={styles.formContainer}>
              <Input
                placeholder="Correo electrónico"
                containerStyle={styles.inputForm}
                onChange={ (e) => onChange(e, "email")}
                rightIcon={
      <Icon
         type="material-community" 
         name="email-outline" 
         iconStyle={styles.iconRight}/>}
      />
              <Input
              placeholder="Contraseña"
              containerStyle={styles.inputForm}
              password={true}
              secureTextEntry={showPassword ? false : true }
              onChange={ (e) => onChange(e, "password")}
              rightIcon={
      <Icon
        type="material-community" 
        name={ showPassword ? "eye-off-outline" : "eye"} 
        iconStyle={styles.iconRight}
        onPress={() => setShowPassword(!showPassword)}
      />          
              }
              />
              <Input
              placeholder="Confirma tu contraseña"
              containerStyle={styles.inputForm}
              password={true}
              secureTextEntry={showRepeatPassword ? false : true}
              onChange={(e) => onChange(e, "repeatPassword")}
              rightIcon={
       <Icon
        type="material-community" 
        name={ showRepeatPassword ? "eye-check-outline" : "eye-check"}
        iconStyle={styles.iconRight2}
        onPress={() =>  setShowRepeatPassword(!showRepeatPassword)}
       />         
              }
              />
              <Button
              titleStyle={styles.btnText}
              title="Crear cuenta"
              containerStyle={styles.btnContainerRegister}
               buttonStyle={styles.btnRegister}  
               onPress={() => onSubmit()}    
               TouchableComponent={TouchableOpacity}   
              />
              <Loading isVisible={loading} text="Creando cuenta" />
          </View>
          

       );
  }
    
 function defaultFormValue(){
     return {
       email: "",
       password: "",
       repeatPassword: "",
     };
 }

   const styles = StyleSheet.create({
       formContainer: {
         flex: 1,
         alignItems: "center",
         justifyContent: "center",
         marginTop: -10,
       },
       inputForm: {
         width: "98%",
         marginTop: 20,
       },
       btnContainerRegister: {
          marginTop: 20,
          width: "95%",
          marginLeft: -2,
       },
       btnRegister: {
         backgroundColor: "#000",
         borderRadius: 10,
         },
         btnText: {
          color: "#f5f5f5f6",
          fontWeight: "bold",
          fontSize: 18,
         },
       iconRight: {
          color: "#c1c1c1c1", 
          width: "70%", 
          marginRight: 20,
       },
       iconRight2: {
         color: "#c1c1c1c1",
         width: "70%",
         marginRight:32,
       },

   });