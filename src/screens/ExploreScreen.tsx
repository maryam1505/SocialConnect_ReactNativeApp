import { Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import TopNav from '../components/TopNav'
import FootNav from '../components/FootNav'
import ExploreSearch from '../../assets/icons/explore-search.svg';
import Feed from '../components/Feed';

const ExploreScreen = () => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const inputRef = useRef<TextInput>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
      const showSub = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
      const hideSub = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
      return () => {
        showSub.remove();
        hideSub.remove();
      };
  }, []);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined } 
    keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{flex:1}}>
          <TopNav />
          {/* ## Screen's  Main Container ## */}
          <View style={styles.container}>
            {/* Search Bar */}
            <Pressable onPress={() => inputRef.current?.focus()} style={styles.searchContainer}>
              <ExploreSearch />
              <TextInput
                ref={inputRef}
                style={styles.searchInput}
                placeholder="Search..."
                placeholderTextColor="#A5BCE7"
                value={query}
                onChangeText={setQuery}
              />
            </Pressable>
            <Feed searchQuery={debouncedQuery} />
          </View>
          {!keyboardVisible && <FootNav />}

        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default ExploreScreen

const styles = StyleSheet.create({
  container: {
    flex:1,
    // justifyContent:'space-between',
    padding: 12,
  },
  searchContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#ffff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    elevation: 0.7,
  },
  searchInput: {
    fontSize: 16,
    color: "#000",
  },
})