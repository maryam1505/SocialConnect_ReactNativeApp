import { FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import PostCard, { Post } from './PostCard';

const posts: Post[] = [
  {
    id: '1',
    userName: 'Elizabeth',
    userAvatar: 'https://example.com/elizabeth.jpg',
    text: 'Lorem ipsum dolor sit amet...',
    imageUrl: 'https://example.com/post1.jpg',
    likes: 85,
    comments: 12,
    shares: 36,
    createdAt: { toDate: () => new Date() },
  },
  {
    id: '2',
    userName: 'John',
    userAvatar: 'https://example.com/john.jpg',
    text: 'Second post sample',
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
