import { Alert, FlatList, ListRenderItem, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useTheme } from '../context/ThemeContext';
import TopNav from '../components/TopNav';
import PrimaryButton from '../components/PrimaryButton';
import auth from '@react-native-firebase/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { CommonActions, useNavigation } from '@react-navigation/native';

type MenuItem = {
  id: string;
  title: string;
  action: () => void;
};

const SettingsScreen = () => {
  type SettingsScreenNavigationProp = NativeStackNavigationProp<
      RootStackParamList,
      'Settings'
    >;
  
  const navigation = useNavigation<SettingsScreenNavigationProp>();

  const handleLogOut = async () => {
    try {
      await auth().signOut();
      Alert.alert("Logged Out", "You have been signed Out");
      navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      }),
    );
    } catch (error: any) {
      Alert.alert('Error Logout',error.message);
    }
  };

  const menuItems: MenuItem[] =[
    {
      id: "1",
      title: "Update Profile Information",
      action: () => navigation.navigate('UpdateProfile' as never),
    },
    {
      id: "2",
      title: "Change Your Password",
      action: () => navigation.navigate('ChangePassword' as never),
    },
    {
      id: "3",
      title: "Notifications",
      action: () => navigation.navigate('Notification' as never),
    },
  ];

  const renderItem: ListRenderItem<MenuItem> = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={item.action}>
      <Text style={styles.text}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <>
    <TopNav/>
    <View style={styles.container}>
      <FlatList
        data={menuItems}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={
          <View style={styles.logoutWrapper}>
            <TouchableOpacity style={styles.item} onPress={handleLogOut}>
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
    </>
  )
}

export default SettingsScreen

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" , width: "100%",},
  item: {
    padding: 16,
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginHorizontal: 16,
  },
  logoutWrapper: {
    marginTop: 50,
    paddingHorizontal: 16,
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  logoutText: {
    color: "#F3904F",
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    borderRadius: 25,
    borderColor: "#f3904f",
    borderWidth: 2,
    paddingHorizontal: 100,
    paddingVertical: 7,
  },
});