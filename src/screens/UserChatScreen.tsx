import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type UserProfileRouteProp = RouteProp<RootStackParamList, 'UserProfile'>;

const UserChatScreen: React.FC = () => {
    const route = useRoute<UserProfileRouteProp>();
    const { userId } = route.params;
  return (
    <View>
      <Text>UserChatScreen</Text>
      <Text>User ID: {userId}</Text>
    </View>
  )
}

export default UserChatScreen

const styles = StyleSheet.create({})