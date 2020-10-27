import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacityComponent } from "react-native";
import { Button, Avatar, Rating } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { map } from "lodash";

import firebaseApp from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function ListFeedback(props) {
    const { navigation, idRestaurant } = props;
    const [ userLogged, setUserLogged ] = useState(false);
    const [ reviews, setReviews ] = useState([]); 

        console.log(reviews);
    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false);
    });

    useEffect(() => {
        db.collection("comments")
          .where("idRestaurant", "==", idRestaurant)
          .get()
          .then((response) => {
            const resultReview = [];
            response.forEach((doc) => {
              const data = doc.data();
              data.id = doc.id;
              resultReview.push(data);
            });
            setReviews(resultReview);
          });
      }, []);

   return ( 
    <View>
        {userLogged ? (
            <Button 
                onPress={() => navigation.navigate('add-comment-restaurant', {idRestaurant: idRestaurant,} )}
                title="Agregar un comentario" 
                containerStyle={styles.containerBtnComment}
                buttonStyle={styles.btnComment}
                titleStyle={styles.btnCommentText}
                icon={{
                    type:"material-community",
                    name:"comment-processing",
                    color: "#3b6ac0",
                    iconStyle:{fontSize: 17},
                }}
                TouchableComponent={TouchableOpacity}
            />
        ):(
            <View>
                <Text 
                onPress={() => navigation.navigate("login")}
            style={styles.messageUserGuest}>{'  '}Para dejar un comentario debes estar logueado 
                        {'                 '} 
                    <Text style={{fontSize: 14, color: '#3b6ac0'}}>presiona en el aviso para ir</Text>
                </Text>
            </View>
        )}
    
        {map(reviews, (review, index) => (
            <Review key={index} review={review} />
        ))}
    </View>
   );
}

function Review(props){
    const { title, comment, rating, createAt, avatarUser } = props.review;
    const createReview = new Date(createAt.seconds * 1000)

    return(
        <View style={styles.viewCommentsbackground} >
            <View style={styles.viewImageAvatar}>
                <Avatar 
                    size="large"
                    rounded
                    containerStyle={styles.avatarImage}
                    source={avatarUser ? {uri: avatarUser} : require('../../../assets/img/avatar-default.jpg')}                
                />
            </View>
            <View style={styles.viewInfo}>
        <Text style={styles.reviewTitle}>{title}</Text>
        <Text style={styles.commentText}>{comment}</Text>       
        <Rating style={{marginLeft:10}} imageSize={13} startinValue={rating} readonly/>
           <Text style={styles.commentsDate}>
               {createReview.getDate()}
               /{createReview.getMonth() + 1}
               /{createReview.getFullYear()}  -
               {createReview.getHours()}:{createReview.getMinutes()}
           </Text>
           </View>
        </View>
    )
};

const styles = StyleSheet.create({
    containerBtnComment: {
        // marginBottom: 10,
        width: "50%",
        marginLeft: "auto",
        marginRight: "auto", 
    },
    btnComment: {
        backgroundColor: "transparent",
        width: "100%",
    },
    btnCommentText: {
        color: "#3b6ac0",
        fontSize: 16,
    },
    messageUserGuest: {
        justifyContent: "space-around",
        textAlign:"center",
        fontSize: 16,
        color: "#900",
    },
    viewCommentsbackground: {
        flexDirection: "row",
        padding: 10,
        paddingBottom: 10,
        borderColor: "#666",
        borderWidth: .1,
        backgroundColor: "#fff",
    },
    viewImageAvatar: {
        borderBottomColor: "#e3e3e3",
    },
    avatarImage: {
        width: 47,
        height: 47,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "#fff",
    },
    viewInfo: { 
      justifyContent: "center",
      alignItems: "flex-start"
    },
    reviewTitle: {
        marginLeft: 10,
        color: "#000",
        fontWeight: "bold",
        fontSize: 16,
     },
     commentText: {
        color: "#222",
        padding: 2,
        marginLeft: 10,
      },
      commentsDate: {
        marginLeft: 230,
        // marginTop: 5,
        marginBottom: -5,
        color: "#777",
        fontSize: 13,
        position: "relative",
        right: 0,
        bottom: 0,
      },
})