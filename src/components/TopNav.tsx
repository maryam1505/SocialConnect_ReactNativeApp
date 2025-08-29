import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback } from 'react';
import BackIcon from '../../assets/icons/back.svg';
import BellIcon from '../../assets/icons/bell-filled.svg';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { useTheme } from '../context/ThemeContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const TopNav = () => {
    const { appTheme } = useTheme(); 
    const route = useRoute<RouteProp<RootStackParamList>>();
    
    type ScreenNavigationProp<T extends keyof RootStackParamList> = NativeStackNavigationProp<RootStackParamList, T>;
    const navigation = useNavigation<ScreenNavigationProp<'Notification'>>();
    
    const handleBellIcon = useCallback(() => {
        navigation.navigate('Notification');
    }, [navigation]);

    return (
        <View style={styles.container}>
            {route.name === 'Home' ? (
                <Text>
        <Text style={[styles.social, {color: appTheme.colors.primaryLight, fontFamily: appTheme.fonts.light.fontFamily},]}>Social</Text>
        <Text style={[styles.connect, { color: appTheme.colors.primaryDark, fontFamily: appTheme.fonts.medium.fontFamily },]}>Connect</Text>
      </Text>
            ) : (
                <>
                <TouchableOpacity>
                    <BackIcon width={22} height={22}/>
                </TouchableOpacity>
                <Text style={[styles.title, {fontFamily: appTheme.fonts.medium.fontFamily, fontWeight: appTheme.fonts.medium.fontWeight}]}>{route.name === 'Profile'? 'Profile': 'New Post'}</Text>
                </>

            )}
            <TouchableOpacity onPress={handleBellIcon}>
                <BellIcon width={22} height={22}/>
            </TouchableOpacity>
        </View>
    )
}

export default TopNav;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        flexDirection: 'row',
        paddingVertical: 12,
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
    title: {
        fontSize: 20,
    },
    social: {
    fontSize: 18,
  },
  connect: {
    fontSize: 20,
  }
});