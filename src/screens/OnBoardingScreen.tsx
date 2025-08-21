import { Image, StyleSheet, Text, View } from 'react-native';
import React, { useCallback } from 'react';
import PrimaryButton from '../components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type OnBoardingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'OnBoarding'
>;

const OnBoardingScreen = () => {
  const navigation = useNavigation<OnBoardingScreenNavigationProp>();

  const handlePress = useCallback(() => {
   navigation.navigate("Login")
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/headerImage.png')}
        style={styles.imageBackground}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Let’s connect {'\n'}with each other</Text>
        <Text style={styles.subtitle}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod
        </Text>
          <PrimaryButton title="Get Started" onPress={handlePress} accessibilityLabel="Get started and navigate to login screen" />
      </View>
    </View>
  );
};

export default OnBoardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  colorWhite: {
    color: '#fff',
  },
  imageBackground: {
    width: '100%',
    height: '55%',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '500',
    fontSize: 40,
    lineHeight: 56,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#1A1B23',
  },
  subtitle: {
    fontFamily: 'Poppins-Semi',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#919191',
  },

  button: {
    width: '80%',
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
