import { BackHandler, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React, { useEffect } from 'react'

const HomeScreen = () => {
  useEffect(()=> {
    const backAction = () => {
      ToastAndroid.show("Back again to exit", ToastAndroid.SHORT);
      BackHandler.exitApp();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress", backAction
    );
    return () => backHandler.remove();
  });
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Home Screen</Text>
    </View>
  )
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    title: {
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '500',
    fontSize: 40,
    lineHeight: 56,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#1A1B23',
    marginBottom: 40,
  },
});