import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { FirebaseAuthTypes} from '@react-native-firebase/auth';
import { getApp } from '@react-native-firebase/app';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import messaging from '@react-native-firebase/messaging';
import { doc, getFirestore, serverTimestamp, setDoc, updateDoc } from '@react-native-firebase/firestore';
import { Alert, AppState, KeyboardAvoidingView, Platform } from 'react-native';
import { checkOnboardingSeen } from './src/utils/storage';
import Loader from './src/components/Loader';
import { createNavigationContainerRef } from '@react-navigation/native';

/* ## Screens ## */
import LoginScreen from './src/screens/LoginScreen';
import OnBoardingScreen from './src/screens/OnBoardingScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import NewPostScreen from './src/screens/NewPostScreen';
import NotificationScreen from './src/screens/NotificationScreen';
import UpdateProfileScreen from './src/screens/UpdateProfileScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import ChatScreen from './src/screens/ChatScreen';
import UserChatScreen from './src/screens/UserChatScreen';
import { useUserPresence } from './src/hook/useUserPresence';

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
  Explore: undefined;
  Chat: undefined;
  UserChat: { chatId : string, chatUserId: string};
  UserProfile: { userId: string };
};

type NotificationData = {
  screen: keyof RootStackParamList;
  userId?: string;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

function MainApp() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [onboardingSeen, setOnboardingSeen] = useState(false);
  const { navigationTheme } = useTheme();

  const app = getApp();
  const auth = getAuth(app);
  const db = getFirestore(app);

  useUserPresence();


  /* ## Save FCM Token and Request Permission ## */
  const requestPermissionAndSaveToken = async () => {
    try {
      /* ## Request permission (iOS) ## */
      await messaging().requestPermission();

      /* ## Get FCM token ## */
      const token = await messaging().getToken();

      const user = getAuth().currentUser;
      if (!user) return;

      const userRef = doc(db, 'users', user.uid);

      /* ## Save/merge the token ## */
      await setDoc(userRef, { fcmToken: token }, { merge: true });
    } catch (err) {
      console.error("Error saving FCM token:", err);
    }
  };

  /* ## Foreground Notifications ## */
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert(remoteMessage.notification?.title ?? 'New Alert', remoteMessage.notification?. body ?? '');

      if(user) {
        const ntfRef = doc(db, 'users', user.uid, 'notifications', Date.now().toString());
        await setDoc(ntfRef,  {
          title: remoteMessage.notification?.title ?? 'New Alert',
          body: remoteMessage.notification?. body ?? '',
          createdAt: new Date(),
  
        });
      }
    });
    return unsubscribe;
  }, [user]);

  /* ## Saving Token on Login (Auth State) ## */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if(user) await requestPermissionAndSaveToken();
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, []);

  /* ## Background or Quite Notifications ## */
  useEffect(() => {
    
  // When app opened from background
  const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
    if (remoteMessage?.data?.screen && navigationRef.isReady()) {
      const data = remoteMessage.data as NotificationData;

      if (data.screen === "UserProfile" && data.userId) {
        navigationRef.current?.navigate("UserProfile", { userId: data.userId });
      } else {
        navigationRef.current?.navigate(data.screen as any);
      }
    }
  });

  // When app opened from quit
  messaging().getInitialNotification().then(remoteMessage => {
    if (remoteMessage?.data?.screen && navigationRef.isReady()) {
      const data = remoteMessage.data as NotificationData;

      if (data.screen === "UserProfile" && data.userId) {
        navigationRef.current?.navigate("UserProfile", { userId: data.userId });
      } else {
        navigationRef.current?.navigate(data.screen as any);
      }
    }
  });

  return unsubscribe;
}, []);
  

  /* ## If the User is Logged In ## */
  useEffect(() => {
    checkOnboardingSeen().then(setOnboardingSeen);
  }, []);

  if (initializing) return <Loader />;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>

      <NavigationContainer theme={navigationTheme} fallback={<Loader/>}>
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
          <Stack.Screen name="UserProfile" component={UserProfileScreen} />
          <Stack.Screen name="UpdateProfile" component={UpdateProfileScreen} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Notification" component={NotificationScreen} />
          <Stack.Screen name="Explore" component={ExploreScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="UserChat" component={UserChatScreen} />
        </Stack.Navigator>
      </NavigationContainer>

    </KeyboardAvoidingView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
} 