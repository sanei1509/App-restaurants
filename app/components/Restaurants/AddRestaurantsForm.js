import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Alert, Dimensions } from "react-native";
import { Icon, Avatar, Image, Input, Button } from "react-native-elements"; 
import { map ,size, filter } from "lodash";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location"; 
import MapView from "react-native-maps";
import uuid from "random-uuid-v4";
import Modal from "../Modal";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);
  
const widthScreen = Dimensions.get("window").width; 

export default function AddRestaurantsForm(props) {
    const { navigation, toastRef, setIsLoading} = props;
    const [ restaurantName,setRestaurantName ] = useState("");
    const [restaurantAddress, setRestaurantAddress ] = useState("");
    const [ restaurantDescription, setRestaurantDescription] = useState("");
    const [ imagesSelected, setImagesSelected ] = useState([]);
    const [ isVisibleMap, setIsVisibleMap ] = useState(false);
    const [locationRestaurant, setIsLocationRestaurant] = useState(null);

    const addRestaurant = () => {
        if(!restaurantName || !restaurantAddress || !restaurantDescription) {
            toastRef.current.show("Todos los campos deben ser completados para publicar.");
        } else if(size(imagesSelected) === 0 ) {
            toastRef.current.show("Debe adjuntar al menos una foto a la publicaión, vuelva  a intentarlo");
        } else if (!locationRestaurant) {
            toastRef.current.show("Por favor ubique el restaurante en el mapa");
        } else {
            setIsLoading(true);
             uploadImageStorage().then(response => {
                db.collection("restaurants")
                .add({
                    name: restaurantName,
                    address: restaurantAddress,
                    description: restaurantDescription,
                    location: locationRestaurant,
                    images: response,
                    rating: 0,
                    ratingTotal: 0,
                    quantityVoting: 0,
                    createAt: new Date(),
                    createBy: firebase.auth().currentUser.uid,
                })
                .then(() => {
                    setIsLoading(false);
                    navigation.navigate("restaurants");
                })
                .catch(() => {
                    setIsLoading(false);
                    toastRef.current.show(
                        "Error a subir el restaurante, reinténtelo más tarde"
                    );
                });
            });
        };
    };

    const uploadImageStorage = async() => {
        // console.log(imagesSelected);
        const imageBlob = [];

     await Promise.all(
        map(imagesSelected, async (image) => {
                const response = await fetch(image);
                const blob = await response.blob();
                const ref = firebase.storage().ref("restaurants").child(uuid());
                await ref.put(blob).then(async(result) => {
                    await firebase
                    .storage()
                    .ref(`restaurants/${result.metadata.name}`)
                    .getDownloadURL()
                    .then((photoUrl)=> {
                        imageBlob.push(photoUrl);
                    });
                });
            })
        );
        return imageBlob;
    };

    return (
        <ScrollView style={styles.scrollView}>
                <ImageRestaurant 
                    imagenPrincipalRestaurant={imagesSelected[0]}
                />
            <FormAdd
            setRestaurantName={setRestaurantName}
            setRestaurantAddress={setRestaurantAddress}
            setRestaurantDescription={setRestaurantDescription}
            setIsVisibleMap={setIsVisibleMap}
            locationRestaurant={locationRestaurant}
            />
            <UploadImage 
                toastRef={toastRef} 
                imagesSelected={imagesSelected} 
                setImagesSelected={setImagesSelected}
            />
            <Button 
                title="Añadir Restaurante"
                onPress={addRestaurant}
                containerStyle={styles.btnUpContainer}
                buttonStyle={styles.btnUpRestaurant}
            />
            <Map isVisibleMap={isVisibleMap}
                 setIsVisibleMap={setIsVisibleMap} 
                 toastRef={toastRef} 
                 setIsLocationRestaurant={setIsLocationRestaurant}
            />
        </ScrollView>
    );
}

    function ImageRestaurant(props) { //imagen principal del screen subir restaurant
        const {imagenPrincipalRestaurant} = props;
       
        return (
            <View style={styles.viewPhoto}>
                <Image 
                    source={
                        imagenPrincipalRestaurant 
                        ?{ uri:  imagenPrincipalRestaurant } 
                        : require("../../../assets/img/no-image.png") }
                    style={{width: widthScreen,height: 230,}}
                />
            </View>
        );
    }

    function FormAdd(props) {
        const {setRestaurantName,
                setRestaurantAddress,
                setRestaurantDescription,
                setIsVisibleMap,
                locationRestaurant
        } = props

        return(
            <View style={styles.viewForm}>
                <Input 
                    placeholder="Nombre del restaurante"
                    containerStyle={styles.Input}
                    onChange={(e) => setRestaurantName(e.nativeEvent.text)}
                />
                <Input 
                    placeholder="Dirección del restaurante"
                    containerStyle={styles.input}
                    onChange={(e)=> setRestaurantAddress(e.nativeEvent.text)}
                    rightIcon={{
                        type: "material-community",
                        name: "google-maps",
                        color: !locationRestaurant ? "#f00946" : "#00a797",
                        onPress: () => setIsVisibleMap(true),
                    }}
                />
                <Input 
                    placeholder="Descripción o comentario del restaurante.."
                    multiline={true}
                    inputContainerStyle={styles.textArea}
                    onChange={(e)=> setRestaurantDescription(e.nativeEvent.text)}
                />
            </View>
        );
    }
    
    function Map(props) {
       const { 
           isVisibleMap,
           setIsVisibleMap,
           toastRef,
           setIsLocationRestaurant, 
     } = props;
     const [location, setLocation]= useState(null);
        
     useEffect(() => {
        (async ()=>{
           const resultPermissions = await Permissions.askAsync(Permissions.LOCATION);
            const statusPermissions = resultPermissions.permissions.location.status; 

            if (statusPermissions !== "granted") {
                toastRef.current.show("Tienes que aceptar el permiso para añadir la localización del restaurante",
                    3000
                );
            } else {
                const loc = await Location.getCurrentPositionAsync({});
                setLocation({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001,
                });
            } 
        })();
     }, []);

     const confirmLocation = () => {
         setIsLocationRestaurant(location);
         toastRef.current.show("Ubicación guardada con éxito");
         setIsVisibleMap(false);    
     };

       return(
        <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
            <View>
                {location && (
                    <MapView
                        style={styles.mapStyle}
                        initialRegion={location}
                        showsUserLocation={true}
                        onRegionChange={(region) => setLocation(region)}
                    >
                        <MapView.Marker 
                            coordinate={{
                            latitude: location.latitude,
                            longitude: location.longitude
                            }}
                            draggable
                         />
                    </MapView>
                )}
                <View style={styles.viewMapBtn}>
                        <Button  
                            title="Marcar Ubicación"
                            containerStyle={styles.btnContainerMaps} 
                            buttonStyle={styles.btnConfirm}
                            onPress={confirmLocation}
                        />   
                        <Button 
                            title="Cancelar" 
                            containerStyle={styles.btnContainerMaps}
                            buttonStyle={styles.btnCancel}
                            onPress={()=> setIsVisibleMap(false)}

                       />
                </View>
            </View>
        </Modal>
     );
    }

    function UploadImage(props) {
        const { toastRef, imagesSelected, setImagesSelected } = props;
        
        
        
        const imageSelect = async () => {
            const resultPermissions = await Permissions.askAsync(
                Permissions.CAMERA_ROLL
            );  
            
            if (resultPermissions === "denied") {
                toastRef.current.show("Es necesario que acepte el permiso para acceder a sus imágenes, puede ir a ajustes y aceptarlo en caso de haberlo rechazado",
                    3000
                );
            } else {
                const result = await ImagePicker.launchImageLibraryAsync({
                    allowsEditing: true,
                    aspect: [4, 3],
                });

                if (result.cancelled) {
                    toastRef.current.show(
                        "No has seleccionado ninguna imágen",
                    2000
                );
                } else {
                    setImagesSelected([...imagesSelected, result.uri]);
                }
            }
        };
            
        const removeImage = (image) => {
            const arrayImages = imagesSelected;
            
            Alert.alert(
                "Eliminar Imagen",
                "¿Estas seguro que quieres eliminar la imagen?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    onPress: () => {
                          setImagesSelected(
                              filter(arrayImages, (imageUrl) => imageUrl !== image)
                        );
                    },
                },
            ],
            { cancelable: false }
            );
        };        

        return (
            <View style={styles.viewImages}>
            {size(imagesSelected) < 5 && (
                <Icon 
                    type="material-community"
                    name="camera"
                    color="#7a7a7a"
                    containerStyle={styles.containerIcon}
                    onPress={imageSelect}
                />
            )}
            {map(imagesSelected, (imageRestaurant, index) => (
                <Avatar 
                    key={index}
                    style={styles.miniatureStyle}
                    source={{uri: imageRestaurant}}
                    onPress={() => removeImage(imageRestaurant)}
                />
        ))}
            </View>
        );
    }

    const styles = StyleSheet.create({
        scrollView: {
            height: "100%",
        },
        viewForm: {
            marginRight: 10,
            marginLeft: 10,
            marginTop:20,
        },
        input: {
            marginBottom: 10,
        },
        textArea: {
            width: "100%",
            height: 100,
            padding: 0,
            margin: 0,
        },
        btnUpContainer: {
            width: "100%",
            marginTop: 20,
        },
        btnUpRestaurant : {
            backgroundColor: "#00a790",
            margin: 20 ,
        },
        viewImages: {
            flexDirection: "row",
            marginLeft: 20,
            marginRight: 20,
            marginTop: 20,
        },
        containerIcon: {
            left: -10,
            alignItems: "center",
            justifyContent: "center",
            marginRight:10 ,
            height: 70,
            width: 70 ,
            backgroundColor: "#e3e3e3",
        },
        miniatureStyle: {
            width: 70,
            height: 70,
            marginRight: 16,
            marginLeft: -13,
        },
        viewPhoto: {
            alignItems: "center",
            height: 200,
            marginBottom: 20,
        },
        mapStyle: {
            width: "100%",
            height: 500,
        },
        viewMapBtn: {
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 10,
        },
        btnContainerMaps: {
            // marginRight: "auto",
            // marginLeft: "auto",
            flexDirection: "row",
        },
        btnConfirm: {
            marginRight: 10,
            backgroundColor: "#000",
            borderBottomWidth: 1,
            borderBottomColor: "#00a680",
        },
        btnCancel: {
            backgroundColor: "#900",
            marginLeft: 10 ,
            borderBottomWidth: 1,
            borderBottomColor: "#00a680",
        },
    });