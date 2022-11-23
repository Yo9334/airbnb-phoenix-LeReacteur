import { useNavigation } from '@react-navigation/core'
import { useEffect, useState } from 'react'
import {
  Text,
  View,
  FlatList,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import axios from 'axios'

export default function HomeScreen() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const navigation = useNavigation()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://express-airbnb-api.herokuapp.com/rooms',
        )
        // console.log(response.data)
        setData(response.data)
        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [])

  const ratingStar = (val) => {
    const tab = []

    for (let index = 0; index < 5; index++) {
      if (index < val) {
        tab.push(<Ionicons name="star" size={25} color="gold" />)
      } else {
        tab.push(<Ionicons name="star" size={25} color="gray" />)
      }
    }

    return tab
  }

  const renderItem = ({ item }) => {
    // console.log(item)
    return (
      <TouchableOpacity
        onPress={() => {
          // alert(JSON.stringify(item))
          navigation.navigate('Room', { id: item._id })
        }}
      >
        <View>
          <ImageBackground
            source={{ uri: item.photos[0].url }}
            style={{
              width: '100%',
              height: 200,
              flexDirection: 'row',
              alignItems: 'flex-end',
            }}
          >
            <View style={styles.offerPriceWrapper}>
              <Text style={styles.offerPrice}>{item.price} €</Text>
            </View>
          </ImageBackground>
          <View style={styles.cardWrapper}>
            <View style={styles.ratingWrapper}>
              <Text style={styles.title}>{item.title}</Text>
              <View style={styles.rating}>
                <Text>{ratingStar(item.ratingValue)}</Text>
                <Text>{item.reviews} reviews</Text>
              </View>
            </View>

            <View style={styles.avatarImgWrapper}>
              <Image
                source={{ uri: item.user.account.photo.url }}
                style={styles.avatarImg}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View>
      {/* <Text>Welcome home!</Text>
      <Button
        title="Go to Profile"
        onPress={() => {
          navigation.navigate('Profile', { userId: 123 })
        }}
      /> */}

      {loading && <Text>loading...</Text>}

      {!loading && (
        <FlatList
          data={data}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
        />
      )}
    </View>
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
