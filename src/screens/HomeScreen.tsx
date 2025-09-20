import {
  BackHandler,
  StyleSheet,
  View,
} from 'react-native';
import React, { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import Feed from '../components/Feed';
import FootNav from '../components/FootNav';
import TopNav from '../components/TopNav';
import { useRoute } from '@react-navigation/native';



const HomeScreen = () => {
  const route = useRoute();
  // const deepLinkPostId = (route.params as any)?.id;
  const { appTheme } = useTheme(); 
  useEffect(() => {
    const backAction = () => {
      /* ToastAndroid.show('Back again to exit', ToastAndroid.SHORT); */
      BackHandler.exitApp();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  });
  return (
    <>
      <TopNav/>

      <View style={[styles.container,{backgroundColor: appTheme.colors.background }]}>
        <Feed />
      </View>

      <FootNav/>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
});
