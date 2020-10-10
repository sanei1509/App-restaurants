import React from "react";
import { createsStackNavigator, createStackNavigator } from "@react-navigation/stack";

import Search from "../screens/Search";

const Stack = createStackNavigator();

export default function SearchStack() {
  return(
   <Stack.Navigator>
       <Stack.Screen
       name="search"
       component={Search}
       options={{ title:"Buscar Restaurantes" }}
       />
   </Stack.Navigator>
  );

}