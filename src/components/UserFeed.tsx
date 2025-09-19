import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import PostCard, { Post } from './PostCard';
import { collection, doc, getDoc, getFirestore, onSnapshot, orderBy, query, where } from '@react-native-firebase/firestore';
import { useTheme } from '../context/ThemeContext';
import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import FeedLoader from './FeedLoader';


const UserFeed: React.FC = () => {
    const { appTheme } = useTheme();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    const app = getApp();
    const currentUserId = getAuth(app).currentUser?.uid;

    const db = getFirestore(app);

    /* ## Fetching Posts of the current User ## */
    useEffect(() => {
    if (!currentUserId) return;

    const postRef = collection(db, 'posts');
    const q = query(postRef, where("userId", "==", currentUserId), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, async snap => {
        if (snap.empty) {
        setPosts([]); 
        setLoading(false);
        return;
        }
        
        const rawPosts = snap.docs.map((docSnap : any) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Post, "id">),
        }));

        const userSnap = await getDoc(doc(db, 'users', currentUserId));
        const userData = userSnap.exists() ? userSnap.data() : {};

        const fetchedPosts: Post[] = rawPosts.map((post: any) => ({
            id: post.id,
            text: post.text,
            imageUrl: post.imageUrl,
            likes: post.likes,
            comments: post.comments,
            shares: post.shares,
            createdAt: post.createdAt,
            name: userData?.name ?? "Unknown",
            username: userData?.username ?? "@unknown",
            avatar: userData?.avatar ?? null,
        }));
        setPosts(fetchedPosts);
        setLoading(false);
    });

    return () => unsubscribe();

    }, [currentUserId]);
    
    
    return (
        <View style={{ flex: 1 }}>
            {loading ? (
                <FeedLoader visible={loading} />
            ) : (
                <FlatList
                data={posts}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <PostCard post={item} />}
                ListEmptyComponent={
                    <View style={styles.empty}>
                    <Text>No posts yet. Be the first to post!</Text>
                    </View>
                }
                />
            )}
        </View>
    )
}

export default UserFeed;

const styles = StyleSheet.create({
    empty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});