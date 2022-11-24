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

export default function HomeScreen({ navigation }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  // const navigation = useNavigation()

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

  const renderItem = ({ item }) => {
    return (
      <View style={styles.main}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Room', { id: item._id })
          }}
        >
          <ImageBackground
            source={{ uri: item.photos[0].url }}
            style={{
              width: '100%',
              height: 200,
              flexDirection: 'row',
              alignItems: 'flex-end',
              marginBottom: 10,
            }}
          >
            <View style={styles.offerPriceWrapper}>
              <Text style={styles.offerPrice}>{item.price} €</Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>

        <View style={styles.cardWrapper}>
          <View style={styles.ratingWrapper}>
            <Text style={styles.title} ellipsizeMode="tail" numberOfLines={1}>
              {item.title}
            </Text>
            <View style={styles.rating}>
              <Text styles={styles.ratingStar}>
                {ratingStar(item.ratingValue, item._id)}
              </Text>
              <Text> {item.reviews} reviews</Text>
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
  main: {
    margin: 10,
  },
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
    // backgroundColor: 'blue',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  ratingWrapper: {
    width: '75%',
  },
  avatarImgWrapper: {
    // backgroundColor: 'pink',
    flex: 1,
    alignItems: 'flex-end',
  },
  avatarImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  ratingStar: {
    padding: 10,
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
