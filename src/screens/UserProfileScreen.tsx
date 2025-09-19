import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import PrimaryButton from '../components/PrimaryButton';

type UserProfileRouteProp = RouteProp<RootStackParamList, 'UserProfile'>;

const UserProfileScreen: React.FC = () => {
  const route = useRoute<UserProfileRouteProp>();
  const { userId } = route.params;
  const handleFollow = () => {

  }

  return (
    <View>
      <Text>User Profile</Text>
      <Text>User ID: {userId}</Text>
        <PrimaryButton onPress={handleFollow} title='Follow' style={{width: '30%'}}/>
    </View>
  );
};


export default UserProfileScreen

const styles = StyleSheet.create({})