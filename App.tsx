import { useColorScheme, StyleSheet } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import OnBoardingScreen from './src/screens/OnBoardingScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { useEffect, useState } from 'react';
import { FirebaseAuthTypes} from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import { checkOnboardingSeen } from './src/utils/storage';
import Loader from './src/components/Loader';
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import NewPostScreen from './src/screens/NewPostScreen';
import NotificationScreen from './src/screens/NotificationScreen';
import UpdateProfileScreen from './src/screens/UpdateProfileScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';

export type RootStackParamList = {
  OnBoarding: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  Home: undefined;
  Profile: undefined;
  UpdateProfile: undefined;
  Settings: undefined;
  NewPost: undefined;
  Notification: undefined;
  ChangePassword: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function MainApp() {
  const isDarkMode = useColorScheme() === 'dark';
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [onboardingSeen, setOnboardingSeen] = useState(false);
  const { navigationTheme } = useTheme();
  const { appTheme } = useTheme();

  /* ## If the User is Logged In ## */
  useEffect(() => {
    const unSubscribe = auth().onAuthStateChanged(user => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    return unSubscribe;
  }, []);

  /* ## If the User is Logged In ## */
  useEffect(() => {
    checkOnboardingSeen().then(setOnboardingSeen);
  }, []);

  if (initializing) return <Loader />;

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          !onboardingSeen ? (
            <>
            <Stack.Screen name="OnBoarding" component={OnBoardingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
            </>
          )
        ) : (
          <Stack.Screen name="Home" component={HomeScreen}  options={{ headerShown: false }} />
        )}

        <Stack.Screen name="NewPost" component={NewPostScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UpdateProfile" component={UpdateProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Notification" component={NotificationScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
