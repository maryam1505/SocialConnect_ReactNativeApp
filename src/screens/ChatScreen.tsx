import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AppText from '../components/AppText'
import TopNav from '../components/TopNav'
import FootNav from '../components/FootNav'
import { collection, doc, getDoc, getFirestore, onSnapshot, orderBy, query } from '@react-native-firebase/firestore'
import { getApp } from '@react-native-firebase/app'
import { RootStackParamList } from '../../App'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import { getAuth } from '@react-native-firebase/auth'
import { formatDistanceToNow } from 'date-fns'
import FeedLoader from '../components/FeedLoader'

type ScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Chat'
>;

type Chat = {
  id: string;
  chatName?: string;
  lastMessage?: string;
  updatedAt?: any;
  otherUser: {
    name: string;
    avatar?: string;
    id: string;
  };
};

const ChatScreen = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] =useState(true);
  const app = getApp();
  const db = getFirestore(app);
  const currentUserId = getAuth(app).currentUser?.uid;

  if(!currentUserId) return;


  const navigation = useNavigation<ScreenNavigationProp>();

  /* ______________________________ Fetching Chat Data ______________________________ */
  useEffect(() => {
    const q = query(collection(db, "chats"), orderBy("updatedAt", "desc"));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chatDocs = snapshot.docs.map((doc :any) => ({ id: doc.id, ...doc.data() }));
      const enrichChat = await Promise.all(
        chatDocs.map(async (chat: any)=> {
          const otherUserId = chat.members.find((id: string) => id !== currentUserId);
          if(!otherUserId) return chat;

          try {
            const userSnap = await getDoc(doc(db, 'users', otherUserId));
            if (userSnap.exists()) {
              return {
                ...chat,
                otherUser: userSnap.data(),
              };
            }
            setLoading(false);
          } catch (error) {
            setLoading(false);
            console.error("Error fetching user data:", error);
          }
          return chat;
        })
      );
      setLoading(false);
      setChats(enrichChat);
    });

    return unsubscribe;
  }, []);

  /* ______________________________ Render Chat Item ______________________________ */
  const renderItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity 
      style={styles.chatItem} 
      onPress={() => navigation.navigate("UserChat", { chatId: item.id, chatUserId: item.otherUser.id})}
      >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* Avatar */}
        {item.otherUser?.avatar ? (
          <Image 
            source={{ uri: item.otherUser.avatar }} 
            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} 
          />
        ) : (
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#ccc", marginRight: 10 }} />
        )}

        {/* Name + Last Message */}
        <View>
          <AppText>{item.otherUser?.name || "User"}</AppText>
          <AppText variant='caption'>{item.lastMessage}</AppText>
        </View>
      </View>

      {/* Time */}
      <AppText variant='caption'>
        {item.updatedAt?.toDate ? formatDistanceToNow(item.updatedAt.toDate()) : "just now"}
      </AppText>
    </TouchableOpacity>
  );

  return (
    <View style={{flex:1}}>
      {loading ? (
        <FeedLoader visible={loading} />
      ) : (
        <>
          <TopNav/>
            <View style={styles.container}>
              <FlatList<Chat>
                data={chats}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListEmptyComponent={
                  <AppText variant='caption' style={{ textAlign: "center", marginTop: 20 }}>No Chat started yet!</AppText>
                }
              />
            </View>
          <FootNav/>
        </>
      )
    }
    </View>

  )
}

export default ChatScreen

const styles = StyleSheet.create({
  container: {
    padding:12,
    flex: 1,
  },
  chatItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});