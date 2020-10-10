import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Input, Button } from "react-native-elements";
import * as firebase from "firebase";

import { validateEmail } from "../../utils/validations";
import { reauthenticate } from "../../utils/api";

export default function ChangeEmailForm(props) {
    const { email, setShowModal, toastRef, setReloadUserInfo } = props
    const [ formData, setFormData ] = useState(defaultValue); 
    const [ showPassword, setShowPassword ] = useState(false);
    const [errors, setErrors] = useState({});
    const [ isLoading, setIsLoading ] = useState(false);

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text})
    }

    const onSubmit = () => {
        setErrors({});
        if(!formData.email || email === formData.email) {
           setErrors({
              email: "No es posible realizar el cambio"
            });
        } else if(!validateEmail(formData.email)) {
            setErrors({
                email: "Correo electrónico Inválido"
            });
        }else if(!formData.password){
            setErrors({
                email: "por seguridad debe confirmar con su contraseña"
            });
        }else {
            setIsLoading(true);
            reauthenticate(formData.password)
            .then(response => {
                firebase
                .auth()
                .currentUser
                .updateEmail(formData.email)
                .then(()=> {
                    setIsLoading(false);
                    setReloadUserInfo(true);
                    toastRef.current.show("Cambio de correo electrónico completado!");
                    setShowModal(false);
                })
                .catch(()=> {
                    setIsLoading(false);
                    setErrors({
                        email: "Algo salió mal vuelve a intentarlo por favor"
                    });
                })
                
            })
             .catch(() => {
                 setIsLoading(false);
                 setShowModal(false);
                toastRef.current.show("Contraseña incorrecta, vuelve a intentarlo");
            });
        }
     };

    return(
        <View style={styles.view}>
            <Input 
                placeholder="Nuevo correo electrónico"
                containerStyle={styles.inputEmail}
                defaultValue= { email || "" }
                rightIcon={{
                    type:"material-community",
                    name:"pen",
                    color:"#c1c1c1",
                }}
                onChange={(e) => onChange(e, "email")}
                errorMessage={errors.email}
            />
            <Input 
            placeholder="Contraseña para confirmar cambio"
            containerStyle={styles.inputEmail}
            password={true}
            secureTextEntry={showPassword ? false : true}
            rightIcon={{
                type: "material-community",
                name: showPassword ? "eye-off" : "eye",
                color: "#c1c1c1",
                onPress: () => setShowPassword(!showPassword)
            }}
            onChange={(e) => onChange(e, "password")}
            />
            <Button 
               title="Cambiar correo electrónico"
               containerStyle={styles.btnContainer}
               buttonStyle={styles.btn}
               onPress={onSubmit}
               loading={isLoading}
            />
        </View>
    );
}
 
function defaultValue() {
    return {
        email: "",
        password: "",
    };
}

const styles = StyleSheet.create({
    view : {
        alignItems: "center",
    },
    inputEmail: {
        width: "100%",
        marginBottom: 6, 
    },
    btnContainer: {
        marginTop: 15,
        width: "95%",
    },
    btn: {
        backgroundColor: "#00a680",
    },

});