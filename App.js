import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import HomeScreen from './containers/HomeScreen'
import ProfileScreen from './containers/ProfileScreen'
import SignInScreen from './containers/SignInScreen'
import SignUpScreen from './containers/SignUpScreen'
import SettingsScreen from './containers/SettingsScreen'
// import SplashScreen from './containers/SplashScreen'
import RoomScreen from './containers/RoomScreen'
import AroundMeScreen from './containers/AroundMeScreen'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [userToken, setUserToken] = useState(null)
  const [userId, setUserId] = useState(null)

  const setToken = async (token, id) => {
    if (token) {
      await AsyncStorage.setItem('userToken', token)
      await AsyncStorage.setItem('userId', id)
    } else {
      await AsyncStorage.removeItem('userToken')
      await AsyncStorage.removeItem('userId')
    }

    setUserToken(token)
    setUserId(id)
  }

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      // We should also handle error for production apps
      const userToken = await AsyncStorage.getItem('userToken')
      const userId = await AsyncStorage.getItem('userId')

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      setUserToken(userToken)
      setUserId(userId)

      setIsLoading(false)
    }

    bootstrapAsync()
  }, [])

  if (isLoading === true) {
    // We haven't finished checking for the token yet
    return null
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userToken === null ? (
          // No token found, user isn't signed in
          <>
            <Stack.Screen name="SignIn">
              {() => <SignInScreen setToken={setToken} />}
            </Stack.Screen>
            <Stack.Screen name="SignUp">
              {() => <SignUpScreen setToken={setToken} />}
            </Stack.Screen>
          </>
        ) : (
          // User is signed in ! 🎉
          <Stack.Screen name="Tab" options={{ headerShown: false }}>
            {() => (
              <Tab.Navigator
                screenOptions={{
                  headerShown: false,
                  tabBarActiveTintColor: 'tomato',
                  tabBarInactiveTintColor: 'gray',
                }}
              >
                <Tab.Screen
                  name="TabHome"
                  options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name={'ios-home'} size={size} color={color} />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen
                        name="Home"
                        options={{
                          title: 'My App',
                          //headerStyle: { backgroundColor: 'blue' },
                          headerTitleStyle: { color: 'white' },
                        }}
                        component={HomeScreen}
                      >
                        {/* {() => <HomeScreen />} */}
                      </Stack.Screen>

                      <Stack.Screen
                        name="Profile"
                        options={{
                          title: 'User Profile',
                        }}
                      >
                        {() => <ProfileScreen />}
                      </Stack.Screen>

                      <Stack.Screen
                        name="Room"
                        options={{
                          title: 'Room',
                        }}
                        component={RoomScreen}
                      >
                        {/* {() => <RoomScreen />} */}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>

                <Tab.Screen
                  name="TabAroundMe"
                  options={{
                    tabBarLabel: 'Around Me',
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons
                        name="location-outline"
                        size={size}
                        color={color}
                      />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen
                        name="AroundMe"
                        options={{
                          title: 'Around me',
                        }}
                      >
                        {() => <AroundMeScreen />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>

                <Tab.Screen
                  name="TabSettings"
                  options={{
                    tabBarLabel: 'Settings',
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons
                        name={'ios-options'}
                        size={size}
                        color={color}
                      />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen
                        name="Settings"
                        options={{
                          title: 'Settings',
                        }}
                      >
                        {() => <SettingsScreen setToken={setToken} />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
              </Tab.Navigator>
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
