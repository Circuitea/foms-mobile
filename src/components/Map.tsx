import { Asset } from "expo-asset";
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet } from "react-native";
import { AnimationType, LeafletView, OwnPositionMarker } from 'react-native-leaflet-view';

export function Map({ isFullscreen = false }: { isFullscreen?: boolean }) {

  const [webViewContent, setWebViewContent] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>();
  useEffect(() => {
    let isMounted = true;

    const loadHtml = async () => {
      try {
        const path = require("../../assets/leaflet.html");
        const asset = Asset.fromModule(path);
        await asset.downloadAsync();
        const htmlContent = await FileSystem.readAsStringAsync(asset.localUri!);
        const position =  await Location.getCurrentPositionAsync();

        if (isMounted) {
          setWebViewContent(htmlContent);
          setLocation(position)
        }
      } catch (error) {
        Alert.alert('Error loading HTML', JSON.stringify(error));
        console.error('Error loading HTML:', error);
      }
    };

    loadHtml();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!webViewContent) {
    return <ActivityIndicator size="large" />
  }

  const ownMarker: OwnPositionMarker = {
    animation: {
      type: AnimationType.PULSE,
      iterationCount: 1,
    },
    icon: "",
    position: [location?.coords.latitude, location?.coords.longitude],
    size: [30, 30],
    title: 'Me',
  };

  return isFullscreen ? (
    <LeafletView
      source={{ html: webViewContent }}
      mapCenterPosition={{
        lat: location?.coords.latitude,
        lng: location?.coords.longitude,
      }}
      ownPositionMarker={ownMarker}
    />
  ) : (
    <LeafletView />
  );
}

const styles = StyleSheet.create({
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 16,
  },
  mapSubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});