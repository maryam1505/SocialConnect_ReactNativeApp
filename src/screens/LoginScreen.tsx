import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import auth from '@react-native-firebase/auth';
import PrimaryButton from '../components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import GradientInput from '../components/GradientInput';

const LoginScreen = () => {
  type OnBoardingScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'Login'
  >;

  const navigation = useNavigation<OnBoardingScreenNavigationProp>();

  // Navigate to Sign Up
  const handlePress = useCallback(() => {
    navigation.navigate('Signup');
  }, [navigation]);

  // Formik Validation
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string()
        .min(6, 'Must be at least 6 characters')
        .required('Required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await auth().signInWithEmailAndPassword(values.email, values.password);
        Alert.alert('Success', 'You are Logged in Successfully', [
          { text: 'OK', onPress: () => navigation.navigate('Home') },
        ]);
      } catch (err) {
        console.error(err);
        Alert.alert('OOPs! Login Failed');
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Forgot Password
  const handleForgotPassword = async () => {
    if (!formik.values.email) {
      Alert.alert('Error', 'Please enter your email first.');
      return;
    }
    try {
      await auth().sendPasswordResetEmail(formik.values.email);
      Alert.alert('Password Reset', 'Check your email for reset link.');
    } catch (error) {
      Alert.alert('Somethings wrong!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <View style={styles.formContainer}>
        {/* Email Input */}
        <GradientInput
          placeholder="Enter your Email"
          value={formik.values.email}
          onChangeText={formik.handleChange('email')}
          onBlur={formik.handleBlur('email')}
          keyboardType="email-address"
          autoCapitalize="none"
          error={formik.touched.email ? formik.errors.email : ''}
        />

        {/* Password Input */}
        <GradientInput
          placeholder="Enter Your Password"
          secureTextEntry
          value={formik.values.password}
          onChangeText={formik.handleChange('password')}
          onBlur={formik.handleBlur('password')}
          error={formik.touched.password ? formik.errors.password : ''}
        />

        {/* Forgot Password */}
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPassword}>Forgot your password?</Text>
        </TouchableOpacity>

        <PrimaryButton
          title={formik.isSubmitting ? 'Signing in...' : 'Sign In'}
          onPress={formik.handleSubmit}
          accessibilityLabel="Submitting Login Form"
        />

        {/* Sign Up Link */}
        <View style={styles.signupContainer}>
          <Text>Don’t have an account? </Text>
          <TouchableOpacity onPress={handlePress}>
            <Text style={styles.signupText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '500',
    fontSize: 40,
    lineHeight: 56,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#1A1B23',
    marginBottom: 40,
  },
  formContainer: {
    width: '100%',
    padding: 10,
  },
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    color: '#8a2be2',
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  signupText: {
    color: 'purple',
    fontWeight: '700',
  },
});
