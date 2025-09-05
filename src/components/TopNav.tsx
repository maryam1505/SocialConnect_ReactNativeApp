import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback } from 'react';
import BellIcon from '../../assets/icons/bell-filled.svg';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { useTheme } from '../context/ThemeContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from './Header';
import BackIcon from '../../assets/icons/back.svg';


const TopNav = () => {
    const { appTheme } = useTheme();
    const route = useRoute<RouteProp<RootStackParamList>>();
    
    type ScreenNavigationProp<T extends keyof RootStackParamList> = NativeStackNavigationProp<RootStackParamList, T>;
    const navigation = useNavigation<ScreenNavigationProp<'Notification'>>();
    
    const handleBellIcon = useCallback(() => {
        navigation.navigate('Notification');
    }, [navigation]);

    const handleSettings = useCallback(() => {
        navigation.navigate('Settings');
    }, [navigation]);

    const backAction = useCallback(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
            return true;
        }
        return false;
    }, [navigation]);

    return (
        <View style={styles.container}>
            {/* ## Home Screen Header bar ## */}
            {route.name === 'Home' && (
                <Header
                    title={
                    <>
                        <Text
                        style={[
                            styles.social,
                            {
                            color: appTheme.colors.primaryLight,
                            fontFamily: appTheme.fonts.light.fontFamily,
                            },
                        ]}
                        >
                        Social
                        </Text>
                        <Text
                        style={[
                            styles.connect,
                            {
                            color: appTheme.colors.primaryDark,
                            fontFamily: appTheme.fonts.medium.fontFamily,
                            },
                        ]}
                        >
                        Connect
                        </Text>
                    </>
                    }
                    rightComponent={
                    <TouchableOpacity onPress={handleBellIcon}>
                        <BellIcon width={22} height={22} />
                    </TouchableOpacity>
                    }
                    styles={styles}
                    appTheme={appTheme}
                />
            )}

            {/* ## New Post Screen Header bar ## */}
            {route.name === 'NewPost' && (
                <Header
                    showBack
                    title="New Post"
                    onBack={backAction}
                    showSettings
                    onSettings={handleSettings}
                    styles={styles}
                    appTheme={appTheme}
                />
            )}

            {/* ## Profile Screen Header bar ## */}
            {route.name === 'Profile' && (
                <Header
                    showBack
                    title="Profile"
                    onBack={backAction}
                    showSettings
                    onSettings={handleSettings}
                    styles={styles}
                    appTheme={appTheme}
                />
            )}

            {/* ## Update Profile Screen Header bar ## */}
            {route.name === 'UpdateProfile' && (
                <> 
                    <View style={styles.settingsTitle}> 
                        <TouchableOpacity onPress={backAction}> 
                            <BackIcon width={22} height={22}/> 
                        </TouchableOpacity> 
                        <Text style={[styles.title, {fontFamily: appTheme.fonts.medium.fontFamily, fontWeight: appTheme.fonts.medium.fontWeight}]}> Update Profile</Text> 
                    </View> 
                </>
            )}

            {/* ## Notification Screen Header bar ## */}
            {route.name === 'Notification' && (
                <> 
                    <View style={styles.settingsTitle}> 
                        <TouchableOpacity onPress={backAction}> 
                            <BackIcon width={22} height={22}/> 
                        </TouchableOpacity> 
                        <Text style={[styles.title, {fontFamily: appTheme.fonts.medium.fontFamily, fontWeight: appTheme.fonts.medium.fontWeight}]}> Notifications</Text> 
                    </View> 
                </>
            )}

            {/* ## Settings Screen Header bar ## */}
            {route.name === 'Settings' && (
                <> 
                    <View style={styles.settingsTitle}> 
                        <TouchableOpacity onPress={backAction}> 
                            <BackIcon width={22} height={22}/> 
                        </TouchableOpacity> 
                        <Text style={[styles.title, {fontFamily: appTheme.fonts.medium.fontFamily, fontWeight: appTheme.fonts.medium.fontWeight}]}> Settings</Text> 
                    </View> 
                </>
            )}
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
    },
    settingsTitle: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
        width: "60%",
    },
    ContainerBox: {
        flexDirection: "row",
        alignItems:'center',
        justifyContent: 'space-between',
        width: "100%",
    }
});