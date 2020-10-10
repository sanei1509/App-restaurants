import React from "react";
import{ StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { Image } from "react-native-elements";
import { size } from "lodash";
import { useNavigation } from "@react-navigation/native";

export default function ListRestaurants(props) {
    const { restaurants, handleLoadMore, loading } = props;
    const navigation = useNavigation();

    return(
        <View style={styles.viewBody}>
         {
           size(restaurants) > 0 ? (
            <FlatList 
                data={restaurants}
                renderItem={(dataRestaurants) => <Restaurant restaurants={dataRestaurants} navigation={navigation} />}
                keyExtractor={(item, index) => index.toString()}
                onEndReachedThreshold={0.5} 
                onEndReached={handleLoadMore}
                ListFooterComponent={<FooterList loading={loading} />}           
            />
            ): (
                <View style={styles.loaderRestaurants}>
                    <ActivityIndicator size="large" />
                        <Text>Cargando Restaurantes...</Text>
                </View>
            )  
         }
        </View>
    );
}

function Restaurant(props) {
    const { restaurants, navigation } = props;
    const { id, images, name, description, address } = restaurants.item;
    const imageRestaurant = images[0]; 

    const openRestaurant = () => {
        navigation.navigate("restaurant",{
            id,
            name,
        });
    } 

    return(
        <TouchableOpacity 
            onPress={openRestaurant}> 
            <View style={styles.viewRestaurant}>
                <View style={styles.viewRestaurantImage}>
                    <Image 
                        resizeMode="cover"
                        PlaceholderContent={<ActivityIndicator color="red" />}
                        source={
                            imageRestaurant 
                            ? {uri: imageRestaurant} 
                            : require('../../../assets/img/no-image.png')
                                }
                        style={styles.viewImages}
                        containerStyle={styles.viewContainerImages}
                    />
                </View>
                <View>
                            <Text style={styles.restaurantName}>{name}</Text>
                            <Text style={styles.restaurantAddress}>{address}</Text>
                            <Text style={styles.restaurantDescription}>
                                {description.substr(0, 60)}...
                            </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
};

function FooterList(props){
   const { loading } = props;

   if(loading) {
       return(
           <View style={styles.loaderRestaurants}>
               <ActivityIndicator 
                    size="large"
               />
                   
           </View>
       );
   } else {
       return(
           <View style={styles.notFoundMore}>
               <Text>No hay más para ver vuelve más tarde..</Text>
           </View>
       )
   }
};

const styles = StyleSheet.create({
    viewBody: {
        color:"#0b0b0b",
        backgroundColor: "#f5f5f5f7",
    },
    loaderRestaurants: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    viewRestaurant: {
        flexDirection: "row",
        margin: 10,
    },
    viewRestaurantImage: {
        marginRight: 15,
    },
    viewImages: {
      width:  150,
      height: 140,
    },
    viewContainerImages: {
        borderRadius: 20,
    },
    restaurantName: {
        fontSize: 20,
        fontWeight: "bold",
        fontStyle: "italic",
        color: "#000",
    },
    restaurantDescription: {
        color: "#c1c1c1",
        paddingTop: 5,
        width: 150,
    },
    restaurantAddress: {
        paddingTop: 5,
        color: "grey",
        width: 200,
    },
    notFoundMore: {
        marginTop: 10,
        marginBottom: 15,
        alignItems: "center",
        fontStyle: "italic",
    },
});