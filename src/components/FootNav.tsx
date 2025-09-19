import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback } from 'react';
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
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useTheme } from '../context/ThemeContext';

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

    return (
        <View style={styles.container}>
            {/* Home */}
            <TouchableOpacity onPress={handleHomeNavigation}>
                <View style={styles.flexIcon}>
                    {route.name === 'Home' ? (
                        <HomeFilled width={36} height={36} />
                    ) : (
                        <HomeIcon width={36} height={36} />
                    )}
                    <Text style={route.name === 'Home' ? {color: appTheme.colors.primaryLight} : null}>Home</Text>
                </View>
            </TouchableOpacity>

            {/* Explore */}
            <TouchableOpacity onPress={handleExplore}>
                <View style={styles.flexIcon}>
                    {route.name === 'Explore' ? (
                        <SearchFilled width={36} height={36} />
                    ) : (
                        <SearchIcon width={36} height={36} />
                    )}
                    <Text style={route.name === 'Explore' ? {color: appTheme.colors.primaryLight} : null}>Explore</Text>
                </View>
            </TouchableOpacity>

            {/* Add / New Post */}
            <TouchableOpacity onPress={handleNewPost}>
                <View style={styles.flexIcon}>
                    {route.name === 'NewPost' ? (
                        <AddFilled width={36} height={36} />
                    ) : (
                        <AddIcon width={36} height={36} />
                    )}
                </View>
            </TouchableOpacity>

            {/* Chat */}
            <TouchableOpacity onPress={handleChat}>
                <View style={styles.flexIcon}>
                    {route.name === 'Chat' ? (
                        <ChatFilled width={36} height={36} />
                    ) : (
                        <ChatIcon width={36} height={36} />
                    )}
                    <Text style={route.name === 'Chat' ? {color: appTheme.colors.primaryLight} : null}>Chats</Text>
                </View>
            </TouchableOpacity>

            {/* Handle Profile */}
            <TouchableOpacity onPress={handleProfile}>
                <View style={styles.flexIcon}>
                    {route.name === 'Profile' ? (
                        <ProfileFilled width={36} height={36} />
                    ) : (
                        <ProfileIcon width={36} height={36} />
                    )}
                    <Text style={route.name === 'Profile' ? {color: appTheme.colors.primaryLight} : null}>Profile</Text>
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
