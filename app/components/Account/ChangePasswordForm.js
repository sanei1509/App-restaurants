import React, { useState } from "react";
import { StyleSheet, View, Text} from "react-native";
import { Input, Button } from "react-native-elements";
import { size } from "lodash";
import { reauthenticate } from "../../utils/api";
import *as firebase from "firebase";

export default function ChangePasswordForm(props) { 
    const {  password, setShowModal, toastRef, setReloadUserInfo} = props
    const [ showPassword, setShowPassword ] = useState(false);
    const [ showConfirmPassword, setShowConfirmPassword ] = useState(false);
    const [ formData, setFormData ] = useState(defaultValue);
    const [errors, setErrors] = useState({});

    const [isLoading, setIsLoading] = useState(false);
            

            const onChange = (e, type) => {
                setFormData({...formData, [type] : e.nativeEvent.text })
            };

            const onSubmit = async () => {
                    let isSetErrors = true;
                let errorsTemp = {};
                setErrors({});

                if(
                    !formData.password ||
                    !formData.newPassword ||
                    !formData.repeatNewPassword
                ) {   
                    errorsTemp = {
                         password: !formData.password
                          ?"Asegúrese de completar todo los espacios." : "",
                         newPassword:! formData.newPassword
                          ? "Asegúrese de completar todo los espacios." : "" ,
                        repeatNewPassword: !formData.repeatNewPassword
                          ? "Asegúrese de completar todo los espacios." : "",
                    }
                }  else if(formData.newPassword === formData.password) {
                           errorsTemp = {password: "imposible realizar el cambio porque sus contraseñas son iguales"};      
                    }else if (formData.newPassword !== formData.repeatNewPassword){
                        errorsTemp = {
                            newPassword: "Asegúrese de que las contraseñas coincidan",
                            repeatNewPassword:"Asegúrese de que las contraseñas coincidan",
                        };
                    } else if(size(formData.newPassword) < 6 ){
                        errorsTemp = { newPassword:"Su contraseña debe tener al menos 6 caracteres"}
                    } else {
                        setIsLoading(true);
                        await reauthenticate(formData.password)
                        .then(async () => {
                            setIsLoading(false);
                           await firebase.auth()
                            .currentUser
                            .updatePassword(formData.newPassword)
                            .then(()=>{ 
                                isSetErrors = false ;
                                setIsLoading(false)
                                setShowModal(false);
                                firebase.auth().signOut();
                            }).catch(() => {
                                errorsTemp={ other:"error al actualizar la contraseña" };
                                setIsLoading(false);
                            });
                        })
                        .catch(() => {
                            errorsTemp= { password:"contraseña incorrecta vuelve a intentarlo" };
                        });
                        setIsLoading(false);
                    }
                            
                
             isSetErrors && setErrors(errorsTemp);
                
            }
    return(
        <View style={styles.view}> 
            <Input 
            inputStyle={{fontSize: 14,}}
            placeholder= "Nueva contraseña"
            containerStyle={styles.inputForm}
            secureTextEntry={showPassword ? false : true}
            password={true}
            rightIcon={{
                type: "material-community",
                name: showPassword ?"eye-off":"eye",
                color: "#c1c1c1",
                onPress: () => setShowPassword(!showPassword)
            }}
            onChange={(e) => onChange(e, "newPassword") } 
            errorMessage={errors.newPassword}
            />
            <Input 
            inputStyle={{fontSize: 14,}}
            placeholder= "Repetir nueva contraseña"
            containerStyle={styles.inputForm}
            secureTextEntry={showPassword ? false : true}
            password={true}
            // rightIcon={{
            //     // type: "material-community",
            //     // name: showPassword ? "eye-off" : "eye",
            //     // color: "#c1c1c1",
            //     // onPress: () => setShowPassword(!showPassword)
            // }}
            onChange={(e) => onChange(e, "repeatNewPassword")}
            errorMessage={errors.repeatNewPassword}
           />
            <Input 
            inputStyle={{fontSize: 14,}}
            placeholder= "Contraseña actual para confirmar"
            containerStyle={styles.inputSecurity}
            secureTextEntry={showConfirmPassword ? false : true }
            password={true}
            rightIcon={{
                type: "material-community",
                name: showConfirmPassword ?"shield-off":"shield-check",
                color: "#c1c1c1",
                onPress: () => setShowConfirmPassword(!showConfirmPassword)
            }}
            onChange={(e) => onChange(e, "password")}
            errorMessage={errors.password}
            />
            <Button 
                title= "Cambiar contraseña"
                titleStyle={{fontSize: 15,}}    
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btnChangePassword}
                onPress={onSubmit}
                loading={isLoading}
            />
            <Text>{errors.other}</Text>
        </View>
    );
} 

    function defaultValue() {
        return{
            password: "",
            newPassword: "",
            repeatNewPassword: "",
        }
    };

    const styles = StyleSheet.create({
        view: {
            // alignItems: "center",
            paddingBottom: -20,
        },
        inputForm: {
            width: "100%",
            marginTop: 10,
            marginBottom: -5,
        },
        inputSecurity: {
            width: "100%",
            marginTop: 25,
        },
        btnContainer: {
            marginTop:15,
            width:"99%",
            marginBottom: -10,
        },
        btnChangePassword:{
            backgroundColor:"#00a680",
        },

    });