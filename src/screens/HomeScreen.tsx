import {
  BackHandler,
  StyleSheet,
  View,
} from 'react-native';
import React, { useEffect } from 'react';
import HomeNav from '../components/HomeNav';
import { useTheme } from '../context/ThemeContext';
import Feed from '../components/Feed';


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
      <View style={[styles.container,{backgroundColor: appTheme.colors.background }]}>
        <HomeNav/>
        <Feed/>
      </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
