import {
  BackHandler,
  StyleSheet,
  View,
} from 'react-native';
import React, { useEffect } from 'react';
import HomeNav from '../components/HomeNav';
import { useTheme } from '../context/ThemeContext';
import Feed from '../components/Feed';
import FootNav from '../components/FootNav';


const HomeScreen = () => {
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
        <HomeNav/>
      <View style={[styles.container,{backgroundColor: appTheme.colors.background }]}>
        <Feed/>
      </View>
      <FootNav/>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontWeight: '500',
    fontSize: 40,
    lineHeight: 56,
    letterSpacing: 0,
    textAlign: 'center',
    marginBottom: 40,
  },
});
