import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Ionicons from '@react-native-vector-icons/ionicons';
import { formatDistanceToNow } from 'date-fns';

export interface Post {
  id: string;
  name: string;
  username: string;
  userAvatar: string | number;
  text?: string;
  imageUrl?: string | number;
  likes?: number;
  comments?: number;
  shares?: number;
  createdAt?: { toDate: () => Date };
}

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <View style={styles.card}>
      {/* User Info */}
      <View style={styles.header}>
        <View style={styles.avatarHeader}>
          <View style={styles.avatarContainer}>
            <Image source={
                typeof post.userAvatar === 'string'
                  ? { uri: post.userAvatar }
                  : require('../../assets/images/profile-placeholder.jpg')
              }
              style={styles.avatar}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{post.name}</Text>
            <Text style={styles.time}>{post.username}</Text>
          </View>
        </View>
        <Text style={styles.time}>
          {post?.createdAt
            ? formatDistanceToNow(post.createdAt.toDate(), {
              addSuffix: false,
            })
            : 'Just now'}
        </Text>
      </View>

      {/* Post Text */}
      {post.text ? <Text style={styles.text}>{post.text}</Text> : null}

      {/* Post Image */}
      {post.imageUrl ? (
        <View style={styles.imageCard}> 
          <Image
            source={
              typeof post.imageUrl === 'string'
                ? { uri: post.imageUrl }
                : post.imageUrl
            }
            style={styles.postImage}
          />

        </View>

      ) : null}

      {/* Engagement Row */}
      <View style={styles.engagement}>
        <View style={styles.engageItem}>
          <Ionicons name="heart-outline" size={20} color="#444" />
          <Text style={styles.engageText}>{post.likes ?? 0}</Text>
        </View>
        <View style={styles.engageItem}>
          <Ionicons name="chatbubble-outline" size={20} color="#444" />
          <Text style={styles.engageText}>{post.comments ?? 0}</Text>
        </View>
        <View style={styles.engageItem}>
          <Ionicons name="share-social-outline" size={20} color="#444" />
          <Text style={styles.engageText}>{post.shares ?? 0}</Text>
        </View>
      </View>
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    padding: 12,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent:'space-between' , marginBottom: 10 },
  avatarHeader: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
  },
  avatarContainer: {
    width:50,
    height:50,
    marginRight: 10,
  },
  avatar: { width: "100%", height: "100%", borderRadius: 25,},
  name: { fontWeight: 'bold', fontSize: 16 },
  time: { color: 'gray', fontSize: 12 },
  imageCard: {width:"100%", height: 400, marginTop: 5, marginBottom: 10, },
  postImage: { width: '100%', height: "100%", borderRadius: 10, },
  text: { fontSize: 14, color: '#333', marginTop: 10, marginBottom: 10, textAlign: "justify", paddingHorizontal: 10, },
  engagement: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  engageItem: { flexDirection: 'row', alignItems: 'center' },
  engageText: { marginLeft: 6, fontSize: 13, color: '#444' },
});
