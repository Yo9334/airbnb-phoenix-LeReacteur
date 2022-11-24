// import { useRoute } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Image,
  ImageBackground,
} from 'react-native'

import { Ionicons } from '@expo/vector-icons'
import Swiper from 'react-native-swiper'
import axios from 'axios'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'

export default function RoomScreen({ route }) {
  // const { params } = useRoute()
  // const id = params.id
  const id = route.params.id

  // States
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])

  // Request URL: "https://express-airbnb-api.herokuapp.com/rooms/:id"
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://express-airbnb-api.herokuapp.com/rooms/${id}`,
        )

        // console.log("=====>", response.data);
        setData(response.data)
        setLoading(false)
      } catch (e) {
        console.log(e.message)
      }
    }
    fetchData()
  }, [id])

  const ratingStar = (val, id) => {
    const tab = []

    for (let index = 0; index < 5; index++) {
      let key = id + '-' + index
      if (index < val) {
        tab.push(<Ionicons name="star" size={25} color="gold" key={key} />)
      } else {
        tab.push(<Ionicons name="star" size={25} color="gray" key={key} />)
      }
    }

    return tab
  }

  return loading ? (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color="red" />
    </View>
  ) : (
    <ScrollView>
      <View style={styles.main}>
        <View>
          <View style={{ position: 'relative' }}>
            <Swiper
              style={styles.wrapper}
              dotColor="white"
              activeDotColor="red"
              autoplay
            >
              {data.photos.map((slide) => {
                return (
                  <ImageBackground
                    source={{ uri: slide.url }}
                    style={{
                      width: '100%',
                      height: 200,
                    }}
                  />
                )
              })}
            </Swiper>

            <View style={styles.offerPriceWrapper}>
              <Text style={styles.offerPrice}>{data.price} €</Text>
            </View>
          </View>

          <View style={styles.cardWrapper}>
            <View style={styles.ratingWrapper}>
              <Text style={styles.title} ellipsizeMode="tail" numberOfLines={1}>
                {data.title}
              </Text>
              <View style={styles.rating}>
                <Text>{ratingStar(data.ratingValue, data._id)}</Text>
                <Text>{data.reviews} reviews</Text>
              </View>
            </View>

            <View style={styles.avatarImgWrapper}>
              <Image
                source={{ uri: data.user.account.photo.url }}
                style={styles.avatarImg}
                resizeMode="contain"
              />
            </View>
          </View>

          <Text ellipsizeMode="tail" numberOfLines={3}>
            {data.description}
          </Text>
        </View>

        <MapView
          provider={PROVIDER_GOOGLE}
          // La MapView doit obligatoirement avoir des dimensions
          style={{
            flex: 1,
            minHeight: 300,
            marginBottom: 10,
            marginTop: 10,
          }}
          initialRegion={{
            latitude: 48.856614,
            longitude: 2.3522219,
            latitudeDelta: 0.2,
            longitudeDelta: 0.2,
          }}
          showsUserLocation={true}
        >
          <Marker
            key={data._id}
            coordinate={{
              latitude: data.location[1],
              longitude: data.location[0],
            }}
            title={data.title}
            description={data.description}
          />
        </MapView>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  main: {
    margin: 10,
  },
  wrapper: {
    height: 200,
  },
  // slide: {
  //   height: 200,
  // },
  rating: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '400',
  },
  cardWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  ratingWrapper: {
    width: '75%',
  },
  avatarImgWrapper: {
    flex: 1,
    alignItems: 'flex-end',
  },
  avatarImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  offerPriceWrapper: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'black',
    width: 80,
    minWidth: 80,
    padding: 10,
    alignItems: 'center',
  },

  offerPrice: {
    color: 'white',
  },
})
