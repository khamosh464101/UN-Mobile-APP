import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { ThemeContext } from "../../../../../utils/ThemeContext";
import MapIcon from "../../../../../assets/icons/profile/map.svg";
import MapDarkIcon from "../../../../../assets/icons/profile/map-dark.svg";

const GeoPointQuestion = ({
  question,
  value,
  onChange,
  required = false,
  hint = "",
}) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme.dark;
  const [location, setLocation] = useState(value || null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState("");

  const getLocation = async () => {
    setLoading(true);
    setErrorMsg(null);

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied.");
      setLoading(false);
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    const coords = {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    };
    setLocation(coords);
    onChange(coords);
    fetchAddress(coords);
    setLoading(false);
  };

  const fetchAddress = async (coords) => {
    try {
      const [place] = await Location.reverseGeocodeAsync(coords);
      const formatted = `${place.name || ""}, ${place.street || ""}, ${
        place.city || place.region || ""
      }, ${place.country || ""}`;
      setAddress(formatted);
    } catch (err) {
      setAddress("Unable to get address.");
    }
  };

  const handleMarkerDrag = (e) => {
    const coords = e.nativeEvent.coordinate;
    setLocation(coords);
    onChange(coords);
    fetchAddress(coords);
  };

  useEffect(() => {
    if (!value) {
      getLocation();
    } else {
      fetchAddress(value);
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.questionHeader}>
        <Text style={[styles.question, { color: theme.colors.text }]}>
          {question}
          {required && <Text style={{ color: theme.colors.error }}> *</Text>}
        </Text>
        {hint ? (
          <Text
            style={[styles.hintText, { color: theme.colors.secondaryText }]}
          >
            {hint}
          </Text>
        ) : null}
      </View>

      {loading && <ActivityIndicator size="large" />}
      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

      {location && (
        <View style={styles.mapWrapper}>
          <MapView
            style={styles.map}
            region={{
              ...location,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            mapType="satellite"
          >
            <Marker
              coordinate={location}
              draggable
              onDragEnd={handleMarkerDrag}
            />
          </MapView>
        </View>
      )}

      <View>
        {location && (
          <>
            <Text style={{ color: theme.colors.text, marginTop: 12 }}>
              Latitude: {location.latitude.toFixed(6)}
            </Text>
            <Text style={{ color: theme.colors.text, marginBottom: 12 }}>
              Longitude: {location.longitude.toFixed(6)}
            </Text>
          </>
        )}
        {/* {address !== "" && (
          <View style={styles.addressWrapper}>
            {isDark ? <MapDarkIcon /> : <MapIcon />}
            <Text
              style={[styles.address, { color: theme.colors.secondaryText }]}
              numberOfLines={0}
            >
              {address}
            </Text>
          </View>
        )} */}
      </View>
      {/* <Button
        title="Current Location"
        onPress={getLocation}
        loading={loading}
      /> */}
      <TouchableOpacity
        onPress={getLocation}
        style={[
          styles.currentLocationButton,
          { backgroundColor: theme.colors.primary },
        ]}
      >
        <Text style={{ color: "#fff" }}>Current Location</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  questionHeader: {
    marginBottom: 12,
  },
  question: {
    fontSize: 16,
    fontWeight: "600",
  },
  hintText: {
    fontSize: 13,
    marginTop: 5,
    fontStyle: "italic",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  mapWrapper: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  addressWrapper: {
    flex: 1,
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },
  address: {
    fontStyle: "italic",
  },
  currentLocationButton: {
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
});

export default GeoPointQuestion;
