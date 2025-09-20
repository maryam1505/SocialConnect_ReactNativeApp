import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useTheme } from '../context/ThemeContext';
import AppText from './AppText';

/* ## SVG Icons ## */
import HomeIcon from '../../assets/icons/home.svg';
import HomeFilled from '../../assets/icons/home-filled.svg';
import ProfileIcon from '../../assets/icons/profile.svg';
import ProfileFilled from '../../assets/icons/profile-filled.svg';
import AddIcon from '../../assets/icons/add.svg';
import AddFilled from '../../assets/icons/add-filled.svg';
import SearchIcon from '../../assets/icons/search.svg';
import SearchFilled from '../../assets/icons/search-filled.svg';
import ChatIcon from '../../assets/icons/chat.svg';
import ChatFilled from '../../assets/icons/chat-filled.svg';


const FootNav = () => {
    const { appTheme } = useTheme(); 
    type HomeScreenNavigationProp = NativeStackNavigationProp<
        RootStackParamList,
        'Home'
        >;
    
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const route = useRoute<RouteProp<RootStackParamList>>();

    const handleHomeNavigation = useCallback(() => {
        navigation.navigate('Home');
    }, [navigation]);
    const handleExplore = useCallback(() => {
        navigation.navigate('Explore');
    }, [navigation]);
    const handleNewPost = useCallback(() => {
        navigation.navigate('NewPost');
    }, [navigation]);
    const handleChat = useCallback(() => {
        navigation.navigate('Chat');
    }, [navigation]);
    const handleProfile = useCallback(() => {
        navigation.navigate('Profile');
    }, [navigation]);

    const isActive = (screen: keyof RootStackParamList) => route.name === screen;
    const getLabelColor = (screen: keyof RootStackParamList) => isActive(screen) ? appTheme.colors.primaryLight : appTheme.colors.textSecondary;

    return (
        <View style={[styles.container, { backgroundColor: appTheme.colors.background }]}>
            {/* Home */}
            <TouchableOpacity onPress={handleHomeNavigation}>
                <View style={styles.flexIcon}>
                    {isActive('Home') ? (
                        <HomeFilled width={30} height={30} />
                    ) : (
                        <HomeIcon width={30} height={30} />
                    )}
                    <AppText variant='small' style={{color: getLabelColor('Home')}}>Home</AppText>
                </View>
            </TouchableOpacity>

            {/* Explore */}
            <TouchableOpacity onPress={handleExplore}>
                <View style={styles.flexIcon}>
                    {isActive('Explore') ? (
                        <SearchFilled width={30} height={30} />
                    ) : (
                        <SearchIcon width={30} height={30} />
                    )}
                    <AppText variant='small' style={{color: getLabelColor('Explore')}}>Explore</AppText>
                </View>
            </TouchableOpacity>

            {/* Add / New Post */}
            <TouchableOpacity onPress={handleNewPost}>
                <View style={styles.flexIcon}>
                    {isActive('NewPost') ? (
                        <AddFilled width={30} height={30} />
                    ) : (
                        <AddIcon width={30} height={30} />
                    )}
                </View>
            </TouchableOpacity>

            {/* Chat */}
            <TouchableOpacity onPress={handleChat}>
                <View style={styles.flexIcon}>
                    {isActive('Chat') ? (
                        <ChatFilled width={30} height={30} />
                    ) : (
                        <ChatIcon width={30} height={30} />
                    )}
                    <AppText variant='small' style={{color: getLabelColor('Chat')}}>Chat</AppText>
                </View>
            </TouchableOpacity>

            {/* Handle Profile */}
            <TouchableOpacity onPress={handleProfile}>
                <View style={styles.flexIcon}>
                    {isActive('Profile') ? (
                        <ProfileFilled width={30} height={30} />
                    ) : (
                        <ProfileIcon width={30} height={30} />
                    )}
                    <AppText variant='small' style={{color: getLabelColor('Profile')}}>Profile</AppText>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default FootNav;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingBottom: 7,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: "center"
  },
  flexIcon: {
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 1,
  },
});
