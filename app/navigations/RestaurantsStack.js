import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Restaurants from "../screens/Restaurants/Restaurants";
import AddRestaurants from "../screens/Restaurants/AddRestaurants";
import Restaurant from "../screens/Restaurants/Restaurant";
import AddCommentRestaurant from "../screens/Restaurants/AddCommentRestaurant";

const Stack = createStackNavigator();

export default function RestaurantsStack() {
    return(
<Stack.Navigator>
    <Stack.Screen
        name="restaurants"
        component={Restaurants}
        options={{ title: "Restaurantes" }}
    />
    <Stack.Screen 
        name="add-restaurants"
        component={AddRestaurants}
        options={{title: "Añadir nuevos restaurantes"}}
    />
    <Stack.Screen name="restaurant" component={Restaurant} /> 
    <Stack.Screen 
        name="add-comment-restaurant"
        component={AddCommentRestaurant}
        options={{ title : 'Nuevos comentarios' }}
    />
</Stack.Navigator>

    );
}

