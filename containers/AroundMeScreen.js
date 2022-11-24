import React, { useEffect, useState } from 'react'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import { Text, View, StyleSheet } from 'react-native'
import * as Location from 'expo-location'

export default function AroundMeScreen() {
  const markers = [
    {
      id: 1,
      latitude: 48.8564449,
      longitude: 2.4002913,
      title: 'Le Reacteur',
      description: 'La formation des champion·ne·s !',
    },
  ]

  const [error, setError] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [coords, setCoords] = useState()

  useEffect(() => {
    const askPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()

      if (status === 'granted') {
        let location = await Location.getCurrentPositionAsync({})

        const obj = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }
        setCoords(obj)
      } else {
        setError(true)
      }

      setIsLoading(false)
    }

    askPermission()
  }, [])

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text>Chargement...</Text>
      ) : error ? (
        <Text>Permission refusée</Text>
      ) : (
        <>
          <View>
            <Text>Latitude de l'utilisateur : {coords.latitude}</Text>
            <Text>Longitude de l'utilisateur : {coords.longitude}</Text>
          </View>

          <MapView
            provider={PROVIDER_GOOGLE}
            // La MapView doit obligatoirement avoir des dimensions
            style={{ flex: 1, height: '100%', width: '100%' }}
            initialRegion={{
              latitude: 48.856614,
              longitude: 2.3522219,
              latitudeDelta: 0.2,
              longitudeDelta: 0.2,
            }}
            showsUserLocation={true}
          >
            {markers.map((marker) => {
              return (
                <Marker
                  key={marker.id}
                  coordinate={{
                    latitude: marker.latitude,
                    longitude: marker.longitude,
                  }}
                  title={marker.title}
                  description={marker.description}
                />
              )
            })}
          </MapView>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#DCDCDC',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
