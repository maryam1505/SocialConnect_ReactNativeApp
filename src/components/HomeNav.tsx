import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useTheme } from '../context/ThemeContext';
import BellIcon from '../../assets/icons/bell-filled.svg';
import { RootStackParamList } from '../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

const HomeNav = () => {
  const { appTheme } = useTheme();
  type ScreenNavigationProp<T extends keyof RootStackParamList> = NativeStackNavigationProp<RootStackParamList, T>;
  const navigation = useNavigation<ScreenNavigationProp<'Notification'>>();

  return (
    <View style={styles.container}>
      
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    width:"100%",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginBottom: 10,

    /* Shadow for iOS and Android */
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  social: {
    fontSize: 18,
  },
  connect: {
    fontSize: 20,
  }
});