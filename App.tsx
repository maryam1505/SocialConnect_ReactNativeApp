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
import { getApp } from '@react-native-firebase/app';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
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
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [onboardingSeen, setOnboardingSeen] = useState(false);
  const { navigationTheme } = useTheme();

  const app = getApp();

  const auth = getAuth(app);
  
  /* ## Check If the User is Logged In ## */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
      if (initializing) setInitializing(false);
  });

    return unsubscribe;
  }, []);

  /* ## If the User is Logged In ## */
  useEffect(() => {
    checkOnboardingSeen().then(setOnboardingSeen);
  }, []);

  if (initializing) return <Loader />;

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!onboardingSeen && !user && (
          <Stack.Screen name="OnBoarding" component={OnBoardingScreen} />
        )}

        {!user && (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
        
        <Stack.Screen name="Home" component={HomeScreen}  />
        <Stack.Screen name="NewPost" component={NewPostScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="UpdateProfile" component={UpdateProfileScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Notification" component={NotificationScreen} />
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
