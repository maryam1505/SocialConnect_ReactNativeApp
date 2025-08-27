import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useTheme } from '../context/ThemeContext';
import BellIcon from '../../assets/icons/bell-filled.svg';

const HomeNav = () => {
  const { appTheme } = useTheme();
  return (
    <View style={styles.container}>
      <Text>
        <Text style={[styles.social, {color: appTheme.colors.primaryLight},]}>Social</Text>
        <Text style={[styles.connect, { color: appTheme.colors.primaryDark, fontFamily: appTheme.fonts.medium.fontFamily },]}>Connect</Text>
      </Text>
      <TouchableOpacity>
        <BellIcon width={22} height={22}/>
      </TouchableOpacity>
    </View>
  )
}

export default HomeNav

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    width:"100%",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginBottom: 20,
    // 🔹 Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    // 🔹 Shadow for Android
    elevation: 3,
  },
  social: {
    fontSize: 16,
  },
  connect: {
    fontSize: 18,
  }
});