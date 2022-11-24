import { useNavigation } from '@react-navigation/core'
import { useState } from 'react'
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import axios from 'axios'

export default function SignInScreen({ setToken }) {
  const navigation = useNavigation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [disabled, setDisabled] = useState(true)

  const handleSubmit = async () => {
    if (!email || !password) {
      return setErrorMessage('Please fill all fields')
    }
    if (errorMessage !== '') {
      setErrorMessage('')
    }

    setDisabled(true)

    try {
      const response = await axios.post(
        'https://express-airbnb-api.herokuapp.com/user/log_in',
        {
          email,
          password,
        },
      )
      if (response.status === 200) {
        const userToken = response.data.token
        const userId = response.data.id
        setToken(userToken, userId)
      } else {
        setErrorMessage('Email or password is wrong.')
      }
    } catch (error) {
      console.log('error', error)
      if (error.status === 401) {
        setErrorMessage('Email or password is wrong.')
      }
    }
  }

  return (
    <KeyboardAwareScrollView>
      <View>
        <View style={styles.wrapper}>
          <Image
            style={styles.imgLogo}
            resizeMode="contain"
            source={require('../assets/airbnb_logo.png')}
          />
          <Text style={styles.greyText}>Sign in</Text>
        </View>
        <View style={styles.formInputs}>
          <TextInput
            style={styles.input}
            placeholder="email"
            onChangeText={(mail) => setEmail(mail)}
            keyboardType="email-address"
            autoCapitalize="none"
            secureTextEntry={false}
            value={email}
          />
          <TextInput
            style={styles.input}
            placeholder="password"
            secureTextEntry={true}
            onChangeText={(pass) => setPassword(pass)}
            value={password}
          />
        </View>

        <View style={styles.formSubmit}>
          <Text style={styles.errorMsg}>{errorMessage && errorMessage}</Text>

          {email && password ? (
            <TouchableOpacity
              disabled={!disabled}
              style={[styles.btnWhite, styles.btnSubmit]}
              onPress={async () => {
                setDisabled(true)
                handleSubmit()
              }}
            >
              <Text style={[styles.btnText, styles.greyText]}>Sign in</Text>
              <ActivityIndicator
                size="small"
                color="#0000ff"
                style={styles.hidden}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              disabled={disabled}
              style={[styles.btnDisabled, styles.btnSubmit]}
              onPress={() => {
                handleSubmit()
              }}
            >
              <Text style={[styles.btnText, styles.greyText]}>Sign in</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SignUp')
            }}
          >
            <Text style={styles.greyTextSmall}>Create an account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: 'white',
    flex: 1,
  },
  wrapper: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgLogo: {
    height: 120,
    width: 150,
    marginBottom: 20,
  },
  greyText: {
    color: 'grey',
    fontWeight: '600',
    fontSize: 20,
  },
  greyTextSmall: {
    color: 'grey',
    fontWeight: '500',
    fontSize: 14,
  },
  formInputs: {
    marginTop: 40,
    marginBottom: 40,
    width: '100%',
    padding: 20,
  },
  input: {
    fontSize: 16,
    borderBottomColor: 'red',
    borderBottomWidth: 1,
    paddingVertical: 5,
    marginBottom: 20,
  },
  formSubmit: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  // container: {
  //   flex: 1,
  //   justifyContent: 'center',
  // },
  // horizontal: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-around',
  //   padding: 10,
  // },
  btnSubmit: {
    // backgroundColor: 'pink',
    height: 60,
    width: '60%',
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnWhite: {
    borderColor: 'red',
    backgroundColor: 'white',
    borderWidth: 3,
    borderRadius: 30,
  },
  btnDisabled: {
    borderColor: 'grey',
    backgroundColor: 'white',
    borderWidth: 3,
    borderRadius: 30,
  },
  hidden: {
    display: 'none',
  },
  errorMsg: {
    color: 'red',
    fontWeight: '500',
    fontSize: 14,
  },
})
