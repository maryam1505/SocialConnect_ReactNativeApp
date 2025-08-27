import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useTheme } from '../context/ThemeContext';
import BellIcon from '../../assets/icons/bell-filled.svg';

const HomeNav = () => {
  const { appTheme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: appTheme.colors.background },]}>
      <Text style={styles.title}>
        <Text style={{color: appTheme.colors.primaryLight}}>Social</Text>
        <Text style={{color: appTheme.colors.primaryDark}}>Connect</Text>
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
    // 🔹 Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    // 🔹 Shadow for Android
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
});