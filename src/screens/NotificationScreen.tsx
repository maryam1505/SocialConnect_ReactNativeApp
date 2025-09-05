import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import TopNav from '../components/TopNav'
import { collection, getFirestore, onSnapshot, orderBy, query } from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';

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
              <Text style={{ fontWeight: 'bold', fontSize: 18, }}>{item.title}</Text>
              <Text style={{fontSize: 16,}}>{item.body}</Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20 }}>No notifications yet</Text>
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