import { FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import PostCard, { Post } from './PostCard';

const posts: Post[] = [
  {
    id: '1',
    userName: 'John Doe',
    userAvatar: require('../../assets/images/feed/user1.jpg'),
    text: 'This is the static post not a dynamic... If this post is showing that means your Firebase Store is empty.',
    imageUrl: require('../../assets/images/feed/blue-post.jpg'),
    likes: 85,
    comments: 12,
    shares: 36,
    createdAt: { toDate: () => new Date() },
  },
  {
    id: '2',
    userName: 'George Arthur',
    userAvatar: require('../../assets/images/feed/user2.jpg'),
    text: 'This is the static post not a dynamic... If this post is showing that means your Firebase Store is empty.',
    likes: 10,
    comments: 2,
    shares: 5,
    createdAt: { toDate: () => new Date() },
  },
];

const Feed: React.FC = () => {
  return (
    <FlatList
      data={posts}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <PostCard post={item} />}
    />
  );
};

export default Feed;

const styles = StyleSheet.create({});
