import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements"; //importacíón de los iconos

import RestaurantsStack from "./RestaurantsStack"; // y esto es lo que vamos a añadir como componente.
import FavoritesStack from "./FavoritesStack"; //antes de esto borramos la importación desde "screens"
import TopRestaurantsStack from "./TopRestaurantsStack";
import SearchStack from "./SearchStack";
import AccountStack from "./AccountStack";

const Tab = createBottomTabNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
        <Tab.Navigator
            initialRouteName="restaurants"
            tabBarOptions={{
                inactiveTintColor: "#fff",
                activeTintColor: "#00a680",
                activeBackgroundColor: "#000",
                inactiveBackgroundColor: "#000",
            }}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color }) => screenOptions(route, color),
            })} 
        >
            <Tab.Screen 
            name="restaurants" 
            component={RestaurantsStack} // add Stack
            options={{ title: "Restaurantes"}} 
            />
            <Tab.Screen 
            name="favorites" 
            component={FavoritesStack} 
            options={{title: "Favoritos" }}
            />
            <Tab.Screen 
            name="top-restaurants" 
            component={TopRestaurantsStack} 
            options={{title: "Top 5"}} 
            />
            <Tab.Screen 
            name="search" 
            component={SearchStack} 
            options={{title: "Buscar"}} 
            />
            <Tab.Screen 
            name="account" 
            component={AccountStack} 
            options={{title: "Mi cuenta"}} 
            />
        </Tab.Navigator>
    </NavigationContainer>
 );
}


  function screenOptions(route, color) {
      let iconName;

    switch (route.name){
         case "restaurants":
            iconName = "compass-outline";
                break;
        case "favorites":
            iconName = "heart-outline"
                break;
        case "top-restaurants":
            iconName = "star-outline"
                break;
        case "search":
            iconName = "magnify"
                break;
        case "account":
            iconName = "home-outline"
                break;
           default:
                break;
      }
    return (
   <Icon type="material-community" name={iconName} size={22} color={color} />
    );
  }
   