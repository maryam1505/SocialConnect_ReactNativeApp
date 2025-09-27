import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import BellIcon from '../../assets/icons/bell-filled.svg';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { useTheme } from '../context/ThemeContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from './Header';
import BackIcon from '../../assets/icons/back.svg';
import AppText from './AppText';
import Menu from '../../assets/icons/menu.svg';
import { doc, getFirestore, onSnapshot } from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';
import { formatDistanceToNow } from 'date-fns';

type ScreenNavigationProp<T extends keyof RootStackParamList> = NativeStackNavigationProp<RootStackParamList, T>;

const TopNav = () => {
    const { appTheme } = useTheme();
    const navigation = useNavigation<ScreenNavigationProp<'Notification'>>();
    const route = useRoute<RouteProp<RootStackParamList>>();

    const app = getApp();
    const db = getFirestore(app);
    const [chatUser, setChatUser] = useState<any>(null);
    
    
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

    useEffect(()=> {
        if (route.name === "UserChat" && (route.params as any)?.chatUserId) {
            const userId = (route.params as any).chatUserId;
            const unsub = onSnapshot(doc(db, "users", userId), (snap) => {
                if (snap.exists()) {
                setChatUser({ id: snap.id, ...snap.data() });
                }
            });
            return () => unsub();
        }
    }, [route.name, (route.params as any)?.chatUserId]);

    return (
        <View style={styles.container}>
            {/* ## Home Screen Header bar ## */}
            {route.name === 'Home' && (
                <Header
                    title={
                    <>
                        <AppText
                        style={[
                            styles.social,
                            {
                            color: appTheme.colors.primaryLight,
                            },
                        ]}
                        >
                        Social
                        </AppText>
                        <AppText
                        style={[
                            styles.connect,
                            {
                            color: appTheme.colors.primaryDark,
                            },
                        ]}
                        >
                        Connect
                        </AppText>
                    </>
                    }
                    rightComponent={
                    <TouchableOpacity onPress={handleBellIcon}>
                        <BellIcon width={22} height={22} />
                    </TouchableOpacity>
                    }
                    styles={styles}
                    appTheme={appTheme}
                    leftComponent={
                        <Menu />
                        }
                />
            )}

            {/* ## Explore Screen Header bar ## */}
            {route.name === 'Explore' && (
                <Header
                    title={
                        <AppText variant='h2'>
                        Explore
                        </AppText>
                    }
                    leftComponent={
                        <Menu />
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
            {route.name === 'Chat' && (
                <Header
                    title={
                        <AppText variant='h2'>
                        Chats
                        </AppText>
                    }
                    leftComponent={
                        <Menu />
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

            {/* ## UserChat Screen Header bar ## */}
            {route.name === 'UserChat' && (
                <Header
                    showBack
                    title={
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 8}}>
                            {/* Avatar */}
                            {chatUser?.avatar ? (
                                <Image
                                    source={{ uri: chatUser.avatar }}
                                    style={{ width: 36, height: 36, borderRadius: 18 }}
                                />
                            ) : (
                                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "#ccc", }} />
                            )}

                            
                            {/* Name + Status */}
                            <View>
                                <AppText variant="h3">{chatUser?.name || "User"}</AppText>
                                <AppText variant="caption" style={{ color: appTheme.colors.primaryLight }}>
                                    {chatUser?.isOnline
                                    ? "Online"
                                    : chatUser?.lastSeen
                                    ? `Last seen ${formatDistanceToNow(chatUser.lastSeen.toDate())} ago`
                                    : "Offline"}
                                </AppText>
                            </View>
                        </View>
                    }
                    onBack={backAction}
                    styles={styles}
                    appTheme={appTheme}
                    rightComponent={
                        <TouchableOpacity onPress={handleBellIcon}>
                            <BellIcon width={22} height={22} />
                        </TouchableOpacity>
                    }
                />
            )}
            {/* ## Profile Screen Header bar ## */}
            {route.name === 'Profile' && (
                <Header
                    showBack
                    title="Profile"
                    onBack={backAction}
                    styles={styles}
                    appTheme={appTheme}
                    showSettings
                    onSettings={handleSettings}
                />
            )}

            {/* ## UserProfile Screen Header bar ## */}
            {route.name === 'UserProfile' && (
                <Header
                    showBack
                    title="User Profile"
                    onBack={backAction}
                    styles={styles}
                    appTheme={appTheme}
                    rightComponent={
                    <TouchableOpacity onPress={handleBellIcon}>
                        <BellIcon width={22} height={22} />
                    </TouchableOpacity>
                    }
                />
            )}

            {/* ## Update Profile Screen Header bar ## */}
            {route.name === 'UpdateProfile' && (
                <> 
                    <View style={styles.settingsTitle}> 
                        <TouchableOpacity onPress={backAction}> 
                            <BackIcon width={22} height={22}/> 
                        </TouchableOpacity> 
                        <AppText variant='h2'> Update Profile</AppText> 
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
                        <AppText variant='h2'> Notifications</AppText> 
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
                        <AppText variant='h2'> Settings</AppText> 
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
        marginBottom: 2,
        /* Shadow for iOS and Android */
        // shadowColor: "#000",
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 4,
        // elevation: 3,
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
        width: "65%",
    },
    ContainerBox: {
        flexDirection: "row",
        alignItems:'center',
        justifyContent: 'space-between',
        width: "100%",
    }
});