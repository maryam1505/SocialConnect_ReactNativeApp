import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';

const Loader = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/splashImage.png')}
        style={{ width: "50%", height: "50%" }}
      />
      <ActivityIndicator size="large" color={'purple'} />
      <Text style={styles.title}>Loading...</Text>
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // or match your theme
  },
  title: {
    marginTop: 10,
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    fontWeight: 200,
  },
});
