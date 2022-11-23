import { useNavigation } from '@react-navigation/core'
import { useState } from 'react'
import {
  Image,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import axios from 'axios'

export default function SignUpScreen({ setToken }) {
  const navigation = useNavigation()

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [description, setDescription] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [disabled, setDisabled] = useState(true)

  const handleSubmit = async () => {
    try {
      if (email && username && description && password && confirmPassword) {
        if (password === confirmPassword) {
          const response = await axios.post(
            'https://express-airbnb-api.herokuapp.com/user/sign_up',
            {
              email: email,
              username: username,
              description: description,
              password: password,
            },
          )
          // console.log("response.data ", response.data);
          // console.log("response.data.token ", response.data.token);

          if (response.data.token) {
            const userToken = response.data.token
            const userId = response.data.id
            setToken(userToken, userId)
          }
        } else {
          setErrorMessage('Passwords are not the same.')
        }
      } else {
        setErrorMessage('Please fill all fields.')
      }
    } catch (error) {
      console.log(error.response.data.error)
      if (
        error.response.data.error === 'This email already has an account.' ||
        error.response.data.error === 'This username already has an account.'
      ) {
        setErrorMessage(error.response.data.error)
      } else {
        setErrorMessage('An error occurred.')
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
          <View style={{ paddingLeft: 20, paddingRight: 20 }}>
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
              placeholder="username"
              onChangeText={(user) => setUsername(user)}
              value={username}
            />
            <TextInput
              style={styles.textArea}
              placeholder="Describe yourself in a few words..."
              onChangeText={(desc) => setDescription(desc)}
              value={description}
              multiline={true}
            />
            <TextInput
              style={styles.input}
              placeholder="password"
              secureTextEntry={true}
              onChangeText={(pass) => setPassword(pass)}
              value={password}
            />
            <TextInput
              style={styles.input}
              placeholder="confirm password"
              secureTextEntry={true}
              onChangeText={(confirm) => setConfirmPassword(confirm)}
              value={confirmPassword}
            />
          </View>
        </View>

        <View style={styles.formSubmit}>
          <Text style={styles.errorMsg}>{errorMessage && errorMessage}</Text>

          {email && username && description && password && confirmPassword ? (
            <TouchableOpacity
              style={[styles.btnWhite, styles.btnSubmit]}
              onPress={async () => {
                handleSubmit()
              }}
            >
              <Text style={[styles.btnText, styles.greyText]}>Sign up</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.btnDisabled, styles.btnSubmit]}
              onPress={async () => {
                //handleSubmit()
              }}
            >
              <Text style={[styles.btnText, styles.greyText]}>Sign up</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SignIn')
            }}
          >
            <Text style={styles.greyTextSmall}>
              Already have an account ? Sign in
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: 'red',
    flex: 1,
  },
  wrapper: {
    marginTop: 10,
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
    width: '100%',
  },
  input: {
    fontSize: 16,
    borderBottomColor: 'red',
    borderBottomWidth: 1,
    paddingVertical: 5,
    marginBottom: 20,
  },
  formSubmit: {
    backgroundColor: 'pink',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSubmit: {
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
  errorMsg: {
    color: 'red',
    fontWeight: '500',
    fontSize: 14,
  },
  textArea: {
    height: 100,
    width: '100%',
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'red',
  },
})
