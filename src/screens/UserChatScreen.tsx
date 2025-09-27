import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import AppText from '../components/AppText';
import { getApp } from '@react-native-firebase/app';
import { addDoc, collection, doc, getFirestore, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import TopNav from '../components/TopNav';
import SendIcon from '../../assets/icons/msg-send.svg';
import LinearGradient from 'react-native-linear-gradient';
import ChatHeader from '../components/ChatHeader';
// import Ionicons from '@react-native-vector-icons/ionicons';


type ScreenRouteProp = RouteProp<RootStackParamList, 'UserChat'>;

type Message = {
  id: string;
  text: string;
  senderId: string;
  createdAt: any;
};

const UserChatScreen: React.FC = () => {
  const route = useRoute<ScreenRouteProp>();
  const { chatId } = route.params;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  const [chatUser, setChatUser] = useState<any>(null);

  const app = getApp();
  const db = getFirestore(app);
  const currentUserId = getAuth(app).currentUser?.uid;

  if(!currentUserId) return;

  useEffect(() => {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc :any) => ({ id: doc.id, ...(doc.data() as Omit<Message, "id">), })));
      
    });

    setLoading(false);
    return unsubscribe;
  }, [chatId]);
  
  useEffect(() => {
  const chatDocRef = doc(db, "chats", chatId);

  const unsub = onSnapshot(chatDocRef, (chatSnap) => {
    if (chatSnap.exists()) {
      const chatData = chatSnap.data();
      if(!chatData) return;
      const otherUserId = chatData.members.find((id: string) => id !== currentUserId);

      if (otherUserId) {
        const userDocRef = doc(db, "users", otherUserId);
        const unsubUser = onSnapshot(userDocRef, (userSnap) => {
          if (userSnap.exists()) {
            setChatUser({ id: userSnap.id, ...userSnap.data() });
          }
        });

        return () => unsubUser();
      }
    }
  });

  return () => unsub();
}, [chatId, currentUserId]);

  const sendMessage = async () => {
    if (!input.trim() || !currentUserId) return;

    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: input,
      senderId: currentUserId,
      createdAt: serverTimestamp(),
    });

    // also update parent chat doc
    await updateDoc(doc(db, "chats", chatId), {
      lastMessage: input,
      updatedAt: serverTimestamp(),
    });

    setInput("");
  };

  const renderMessage = (item: Message) => {
    const isSender = item.senderId === currentUserId;
      if (isSender) {
        return (
          <LinearGradient
            colors={['#200122', '#108DC7']}
            style={[styles.messageContainer, styles.senderContainer]}
          >
            <AppText style={[styles.messageText, styles.senderText]}>
              {item.text}
            </AppText>
          </LinearGradient>
        );
      }
    return (
      
      <View style={[styles.messageContainer, styles.receiverContainer]}>
        <AppText style={[styles.messageText, styles.receiverText]}>
          {item.text}
        </AppText>
      </View>
    );
  };

  return (
    <>
      <ChatHeader chatUser={chatUser}/>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderMessage(item)}
          contentContainerStyle={{ padding: 10 }}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Say something..."
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity onPress={sendMessage}>
            <SendIcon width={50} height={50}/>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      
    </>
  )
}

export default UserChatScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:5,
  },
  messageContainer: {
    maxWidth: "70%",
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
  },
  senderContainer: {
    alignSelf: "flex-end",
    borderTopRightRadius: 0,
    maxWidth: '75%',
    borderRadius: 16,
    padding: 10,
    marginVertical: 4,
  },
  receiverContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderTopLeftRadius: 0,
    maxWidth: '75%',
    borderRadius: 16,
    padding: 10,
    marginVertical: 4,
    elevation: 0.7,
  },
  messageText: {
    fontSize: 15,
  },
  senderText: {
    color: "#fff",
  },
  receiverText: {
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 0.7,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 15,
    marginRight: 10,
  },
});