import { Image, StyleSheet, Text, View } from 'react-native';
import React, { useCallback } from 'react';
import PrimaryButton from '../components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { setOnboardingSeen } from '../utils/storage';
import { useTheme } from '../context/ThemeContext';
import AppText from '../components/AppText';


type OnBoardingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'OnBoarding'
>;

const OnBoardingScreen = () => {
  const navigation = useNavigation<OnBoardingScreenNavigationProp>();
  const { appTheme } = useTheme(); 

  const handlePress = useCallback(async () => {
    await setOnboardingSeen();
    navigation.navigate('Login');
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: appTheme.colors.background },]}>
      <Image
        source={require('../../assets/images/headerImage.png')}
        style={styles.imageBackground}
      />
      <View style={styles.content}>
        <AppText variant='h1' style={[ styles.title, ]}>Let’s connect {'\n'}with each other</AppText>
        <AppText secondary style={[styles.subtitle]}>
          React native app using firebase authentication for better backend experience.
        </AppText>
        <PrimaryButton
          title="Get Started"
          onPress={handlePress}
          accessibilityLabel="Get started and navigate to login screen"
        />
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
    lineHeight: 56,
    letterSpacing: 0,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'center',
  },
});
