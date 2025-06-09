import { LocationObject, LocationSubscription, requestForegroundPermissionsAsync, watchPositionAsync } from "expo-location";
import { fetch } from 'expo/fetch';
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";


export default function Index() {
  const [ location, setLocation ] = useState<LocationObject | null>(null);
  const [ errorMsg, setErrorMsg ] = useState<string | null>(null);

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // let location = await getCurrentPositionAsync({});
      // setLocation(location);

      return watchPositionAsync({
        'timeInterval': 5,
      }, (fetchedLocation) => {
        // fetch('http://192.168.45.5/personnel/location', {
        //   'method': 'post',
        //   'headers': {ContentType: 'application/json'},
        //   'body': JSON.stringify({
        //     'latitude': fetchedLocation.coords.latitude,
        //     'longitude': fetchedLocation.coords.longitude,
        //   }),
        // }).then((response) => {
        //   if (!response.ok) {
        //     setErrorMsg(`Error Code: ${response.status}`);
        //     return;
        //   }
        // });
        setLocation(location);
      });
    }

    let watch: LocationSubscription | undefined;
    getCurrentLocation().then((locationSubscription) => {
        watch = locationSubscription;
    });


    return () => {
      if (watch) {
        watch.remove();
      }
    }

    
  }, [location, errorMsg]);

  let text = 'Loading...';

  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = "ok";
  }

  return (
    <View>
      <Text>You can change this. This is temporary.</Text>
      <Text>{text}</Text>
      <Text>LAT: {location?.coords.latitude}</Text>
      <Text>LNG: {location?.coords.longitude}</Text>
      <Button title="TEST" onPress={() => {
        fetch('http://192.168.45.5/location', {
          headers: {'Content-Type': 'application/json'},
          method: 'post',
          body: JSON.stringify({latitude: location?.coords.latitude, longitude: location?.coords.longitude}),
        }).then((res) => {
          if (!res.ok) {
            console.log(`Error: ${res.status}`);
          }
        });
      }} />
    </View>
  )
}
