import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import { Card, Image, Icon, Rating } from "react-native-elements";

export default function ListTopRestaurants(props) {
  const { favoriteRestaurants, navigation } = props;  
    
  return (
        <FlatList  
            data={favoriteRestaurants}
            renderItem={(restaurants) => <Restaurant restaurants={restaurants} navigation={navigation} />}
            keyExtractor={(item, index) => index.toString()}
        />
    )
}

function Restaurant(props){
    const { restaurants, navigation } = props;
    const { name, id, images, rating, description } = restaurants.item;
    const [ iconColor, setIconColor ] = useState("#000");

    useEffect(()=> {
        if(restaurants.index === 0 ){
            setIconColor("#efb819");
        }else if(restaurants.index === 1) {
            setIconColor("#e3e4e5");
        }else if(restaurants.index ===2){
            setIconColor("#cd7f32");
        }
    }, [])

    
    
    
    return(
        <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate("restaurants", {screen: 'restaurant', params:{ id }})}>
            <Card containerStyle={styles.container}>
                <Icon 
                    // reverse
                    type="material-community"
                    name="trophy-award"
                    color={iconColor}
                    size={30}
                    containerStyle={styles.containerIcon}
                /> 
                <Image
                    borderRadius={0}
                    style={styles.restaurantImage}
                    resizeMode="cover"
                    source={ images[0]
                        ? { uri: images[0] }
                        : (require('../../../assets/img/no-image.png'))
                        }
                />   
                <View style={styles.titleRating}>
                    <Text style={styles.title}>{name}</Text>
                    
                    <Rating 
                        imageSize={20}
                        startingValue={rating}
                        readonly
                        style={styles.rating}
                    />
                </View>
                <Text style={styles.description}>{description}</Text>
            </Card>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        borderWidth: 0,
        elevation: 15,
        backgroundColor: "#fff",
        borderRadius:0,
    },
    containerIcon: {
        position: "absolute",
        top: -20,
        left: -20,
        zIndex: 1,
        justifyContent: "center",
        backgroundColor: '#fff',
        borderRadius: 100,
        width: 50,
        height: 50,
        elevation: 20,
    }, 
    restaurantImage: {
        width: "100%",
        height: 155,
    }, 
    titleRating: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10, 
    },
    title: {
        fontSize: 20,
        color: "#000",
        // marginTop: 5,
        fontWeight: "bold",
        fontStyle: "italic",
    },
    rating: {
        // flex: 1,
        // justifyContent: "flex-end",
        // // marginRight: -170,
    },
    description: {
        color: '#bbb',
        marginTop: 0,
        textAlign: "justify",
    }

})
