import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import TopNav from '../components/TopNav'
import { collection, getFirestore, onSnapshot, orderBy, query } from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import AppText from '../components/AppText';

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const app = getApp();
  const auth = getAuth(app);
  const db = getFirestore(app);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if(!userId) return;
    const q = query(collection(db, 'users', userId, 'notifications'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, snap => {
      const list = snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data()}));
      setNotifications(list);
    });

    return unsubscribe;
  }, [userId]);

  return (
    <>
      <TopNav/>
      <View style={styles.container}>
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <View style={{ padding: 10, borderBottomWidth: 1 }}>
              <AppText variant='h3'>{item.title}</AppText>
              <AppText>{item.body}</AppText>
            </View>
          )}
          ListEmptyComponent={
            <AppText variant='caption' style={{ textAlign: "center", marginTop: 20 }}>No notifications yet</AppText>
          }
        />
      </View>
    </>
  )
}

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});