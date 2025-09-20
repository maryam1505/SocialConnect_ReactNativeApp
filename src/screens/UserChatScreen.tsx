import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import AppText from '../components/AppText';

type UserProfileRouteProp = RouteProp<RootStackParamList, 'UserProfile'>;

const UserChatScreen: React.FC = () => {
    const route = useRoute<UserProfileRouteProp>();
    const { userId } = route.params;
  return (
    <View>
      <AppText>UserChatScreen</AppText>
      <AppText>User ID: {userId}</AppText>
    </View>
  )
}

export default UserChatScreen

const styles = StyleSheet.create({})