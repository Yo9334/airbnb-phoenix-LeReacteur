import { useRoute } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import {
  ScrollView,
  Text,
  View,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native'

import { StatusBar } from 'expo-status-bar'
import { Ionicons } from '@expo/vector-icons'
import axios from 'axios'

export default function RoomScreen() {
  const { params } = useRoute()
  const id = params.id

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
  }, [])

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
      <View>
        <ImageBackground
          source={{ uri: data.photos[0].url }}
          style={{
            width: '100%',
            height: 200,
            flexDirection: 'row',
            alignItems: 'flex-end',
          }}
        >
          <View style={styles.offerPriceWrapper}>
            <Text style={styles.offerPrice}>{data.price} €</Text>
          </View>
        </ImageBackground>
        <View style={styles.cardWrapper}>
          <View style={styles.ratingWrapper}>
            <Text style={styles.title}>{data.title}</Text>
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
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  rating: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  cardWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  avatarImgWrapper: {
    width: '25%',
    alignItems: 'flex-end',
  },
  avatarImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  offerPriceWrapper: {
    backgroundColor: 'black',
    width: 80,
    minWidth: 80,
    padding: 10,
    alignItems: 'center',
    bottom: 10,
  },
  offerPrice: {
    color: 'white',
  },
})
