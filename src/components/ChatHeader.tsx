import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React from 'react';
import BackIcon from '../../assets/icons/back.svg';
import BellIcon from '../../assets/icons/bell-filled.svg';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { formatDistanceToNow } from 'date-fns';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ScreenNavigationProp<T extends keyof RootStackParamList> = NativeStackNavigationProp<RootStackParamList, T>;

const ChatHeader = ({ chatUser }: { chatUser: any }) => {
    const navigation = useNavigation<ScreenNavigationProp<'Notification'>>();

    return (
        <View style={styles.headerContainer}>
        <View style={{flexDirection:'row', gap:8, alignItems: 'center'}}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <BackIcon width={22} height={22} />
            </TouchableOpacity>
            

            {/* Avatar + Name + Status */}
            <View style={styles.userInfo}>
                {chatUser?.avatar ? (
                <Image source={{ uri: chatUser.avatar }} style={styles.avatar} />
                ) : (
                <View style={styles.avatarPlaceholder} />
                )}
                <View>
                <Text style={styles.name}>{chatUser?.name || 'User'}</Text>
                <Text style={[styles.status, {color: chatUser?.isOnline && ("#108DC7")}]}>
                    {chatUser?.isOnline
                    ? 'Online'
                    : chatUser?.lastSeen
                    ? `Last seen ${formatDistanceToNow(chatUser.lastSeen.toDate())} ago`
                    : 'Offline'}
                </Text>
                </View>
            </View>
        </View>

        {/* Right Action (optional) */}
        <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
            <BellIcon width={22} height={22} />
        </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 8,
    },
    avatarPlaceholder: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#ccc',
        marginRight: 8,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
    },
    status: {
        fontSize: 12,
        color: '#777',
    },
});

export default ChatHeader;
