  import React from "react";
  import { StyleSheet, View, Text } from "react-native";
  import { Avatar } from "react-native-elements" 
  import * as firebase from "firebase";
  import * as Permissions from "expo-permissions";
  import * as ImagePicker from "expo-image-picker";

  export default function InfoUser(props) {
    
      const { toastRef, 
              setLoading,
              setLoadingText,
      } = props;
        
      const { 
        userInfo: { uid, photoURL, displayName, email }, 
      } = props;

      const changeAvatar = async () => {
      const resultPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      const resultPermissionCamera = resultPermission.permissions.cameraRoll.status;
      
         if(resultPermissionCamera === "denied") {
            toastRef.current.show("Permisos a la galería necesarios para editar su perfil");
            } else {
           const result = await ImagePicker.launchImageLibraryAsync({
             allowsEditing: true,
             aspect: [4, 3],
           });
          if(result.cancelled) {
             toastRef.current.show("No has seleccionado ninguna imagén");
            } else {
              uploadImage(result.uri)
              .then(() => {
                  // console.log("imagen subida");
                  updatePhotoURL();
              }).catch(() => {
                  toastRef.current.show("Error al cargar avatar");
              });
           }
         }
      };

    const uploadImage = async (uri) => {
        setLoadingText("Actualizando perfil..");
        setLoading(true);

         const response = await fetch(uri);
         const blob = await response.blob();
        //  console.log(JSON.stringify(blob));
         const ref = firebase.storage().ref().child(`avatar/${uid}`);
         return ref.put(blob); //nos devuelve una promesa
      };

        const updatePhotoURL = () => {
            firebase
            .storage()
            .ref(`avatar/${uid}`)
            .getDownloadURL()
            .then(async (response) => {
                const update = {
                  photoURL: response,
                };
                await firebase.auth().currentUser.updateProfile(update)
        setLoading(false);
              })
                .catch(() => {
                    toastRef.current.show("error al actualizar su perfil");
                  });
        };
              
   

   return(
    <View style={styles.viewUserInfo}>
         <Avatar
          rounded
          size="large"
          showEditButton
          onEditPress={changeAvatar}
          containerStyle={styles.userInfoAvatar}
          source= { photoURL ? { uri: photoURL} : require("../../../assets/img/avatar-default.jpg") }
        />
      <View>

          <Text style={{fontSize:18 ,
                          color: "#000",
                          fontWeight:"bold", 
                          marginBottom: 5, 
                          marginLeft: -30
                        }}
            >{displayName ? displayName : "Anónimo"}
            </Text>
           
            <Text style={{color: "#000",
                          marginLeft: -30
                        }}
            >{email ? email : "Social Login"}
            </Text>
         
        </View>
    </View>

   );

}

const styles = StyleSheet.create({
    viewUserInfo: {
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      backgroundColor: "transparent",
    //   paddingTop: 20,
    //   paddingBottom: 20,
        padding: 10,
        marginRight: 50,
      borderRadius: 8,
      marginBottom: 10,
    },
    userInfoAvatar: {
      marginLeft: -100,
     marginRight: 50,
     elevation: 20,
    },
}); 

 