import React from "react";
import MapView from "react-native-maps";
import openMap from "react-native-open-maps";

export default function Map(props) {
    const { name, location, height } = props;

    const openAppMap = ()=> {
        openMap({
            latitude: location.latitude,
            longitude: location.longitude,
            zoom:19,
            query: name
        })
    };

    return(
        <MapView 
            onPress={openAppMap}
            style={{ width: '100%', height: height }}
            initialRegion={location}
        >
            <MapView.Marker 
               coordinate={{
                   latitude: location.latitude,
                   longitude: location.longitude
               }} 
            />
        </MapView>
    )
}