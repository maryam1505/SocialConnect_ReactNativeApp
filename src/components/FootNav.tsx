import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Ionicons from '@react-native-vector-icons/ionicons';
import HomeIcon from "../../assets/icons/home.svg";
import ProfileIcon from "../../assets/icons/profile.svg";
import AddIcon from "../../assets/icons/add.svg";

const FootNav = () => {
  return (
    <View style={styles.container}>
        <View style={styles.flexIcon}>
            <HomeIcon width={36} height={36}/>
            <Text>Home</Text>
        </View>
        <View style={styles.flexIcon}>
            <AddIcon width={36} height={36}/>
        </View>
        <View style={styles.flexIcon}>
            <ProfileIcon width={36} height={36}/>
            <Text>Profile</Text>
        </View>
    </View>
  )
}

export default FootNav

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor:"#fff",
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-around",
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
    },
    flexIcon: {
        flexDirection: "column",
        justifyContent: "center",
        gap: 1,
    }
});