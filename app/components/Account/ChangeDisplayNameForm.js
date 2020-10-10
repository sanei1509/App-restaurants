import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native"; 
import { Input, Button } from "react-native-elements";
import * as firebase from "firebase";
// import Loading from "../Loading";

export default function ChangeDisplayName(props) {
    const { toastRef, displayName, setShowModal, setReloadUserInfo } = props
    const[ newDisplayName, setNewDisplayName] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = () => {
        setError(null);
        if(!newDisplayName) {
             setError("*El usuario no puede estar vacío")
      } else if(displayName === newDisplayName){
            setError("*Esta ingresando el mismo nombre");
      } else {
          setIsLoading(true);
          const update = { 
              displayName: newDisplayName, 
        };
         firebase
            .auth()
            .currentUser
            .updateProfile(update)
            .then(() => {
                setIsLoading(false);
                setReloadUserInfo(true)
                setShowModal(false);
            })
            .catch(() =>{
                setError("Algo salió, intentalo de nuevo por favor");
                setIsLoading(false);
             })
      }
    }


    return(
        <View style={styles.view}>
            <Input
                placeholder="Nombre de usuario"
                containerStyle={styles.inputForm}
                rightIcon={{
                    type: "material-community",
                    name:  "pen",
                    color: "#c2c2c2",
                }}
                defaultValue={displayName && displayName}
                onChange={(e) => setNewDisplayName(e.nativeEvent.text)}
                errorMessage={error}
           />

            <Button 
                title="Cambiar nombre"
                containerStyle={styles.btncContainer}
                buttonStyle={styles.btnChange}
                onPress={onSubmit}
                loading= {isLoading}
            />
        </View>

    );
}

const styles = StyleSheet.create({
        view: {
            alignItems: "center",
            
        },
        inputForm: {
            width: "100%",
        },
        btncContainer: {
            marginTop: 20,
            width: "95%",
        },
        btnChange: {
            backgroundColor: "#00a680"
        },

});