import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Text } from "react-native";
import { Button } from "react-native-elements";
import Toast from "react-native-easy-toast";
import * as firebase from "firebase";
import { transform, upperFirst } from 'lodash';
import Loading from "../../components/Loading";

import InfoUser from "../../components/Account/InfoUser";
import AccountOptions from "../../components/Account/AccountOptions";


export default function UserLogged() {
    const [userInfo, setUserInfo] = useState({});
    const toastRef = useRef();
    const [ loading, setLoading ] = useState(false);  
    const [ loadingText, setLoadingText] = useState("");
    const [reloadUserInfo, setReloadUserInfo] = useState(false);

     useEffect(() => {
       (async () => {
          const user = await firebase.auth().currentUser; 
          setUserInfo(user);
       })()
        setReloadUserInfo(false);
     }, [reloadUserInfo])

    return (
     <View style={styles.viewUserInfo}>
       {userInfo && <InfoUser 
                        userInfo={userInfo} 
                        toastRef={toastRef} 
                        setLoading={setLoading}
                        setLoadingText={setLoadingText}
                        />}

         <AccountOptions userInfo={userInfo} 
                         toastRef={toastRef}
                         setReloadUserInfo={setReloadUserInfo}
                         />

      <Button 
      title="Cerrar sesión"
      buttonStyle={styles.btnCloseSesion}
      titleStyle={styles.btnText}
      onPress={() => firebase.auth().signOut()}
      />
          <Toast ref={toastRef} position="center" opacity={0.95} style={{backgroundColor: "#cf1b1b"}} />
          <Loading isVisible={loading} text={loadingText} />    
     </View>

   );

}

const styles = StyleSheet.create({
   viewUserInfo: {
   
     minHeight: "100%",
     backgroundColor: "#f2f2f2",
     marginTop: 0,
   },
   btnCloseSesion: {
     width: "95%",
    marginTop: 30,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 10,
    backgroundColor: "#fff",
    borderTopWidth: 0.5,
    borderTopColor: "#000",
    borderBottomWidth: 0.8,
    borderBottomColor: "#00a680",
    paddingTop: 8,
    paddingBottom: 8,
   },
   btnText: {
     color: "#000",
     fontSize: 18,
     fontStyle: "italic",
     fontWeight: "bold",
   },
   onPressIn: {
     backgroundColor: "#c1c1c1",
   },
}); 