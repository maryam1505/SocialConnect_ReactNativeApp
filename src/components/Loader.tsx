import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import AppText from './AppText';

const Loader = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/splashImage.png')}
        style={{ width: "50%", height: "50%" }}
      />
      <ActivityIndicator size="large" color={'#1A2B44'} />
      <AppText variant='caption'>Loading...</AppText>
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
