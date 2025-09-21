import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback} from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getApp } from '@react-native-firebase/app';
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword} from '@react-native-firebase/auth';
import PrimaryButton from '../components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import GradientInput from '../components/GradientInput';
import { useTheme } from '../context/ThemeContext';
import AppText from '../components/AppText';


type OnBoardingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;


const LoginScreen = () => {
  const navigation = useNavigation<OnBoardingScreenNavigationProp>();

  const { appTheme } = useTheme(); 
  const app = getApp();
  const auth = getAuth(app);

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
        await signInWithEmailAndPassword(auth, values.email, values.password);

        Alert.alert('Success', 'You are Logged in Successfully', [
          { text: 'OK', onPress: () => navigation.navigate('Home') },
        ]);
      } catch (err) {
      let errorMessage = 'Something went wrong. Please try again later.';

        if (
          typeof err === 'object' &&
          err !== null &&
          'code' in err &&
          typeof (err as any).code === 'string'
        ) {
          const errorCode = (err as any).code;

          if (errorCode === 'auth/user-not-found') {
            errorMessage = 'No user found with this email.';
          } else if (errorCode === 'auth/wrong-password') {
            errorMessage = 'Incorrect password.';
          } else if (errorCode === 'auth/too-many-requests') {
            errorMessage = 'Too many failed attempts. Try again later.';
          }
          Alert.alert('OOPs! Login Failed', errorMessage);
        }
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
      await sendPasswordResetEmail(auth, formik.values.email);
      Alert.alert('Password Reset', 'Check your email for reset link.');
    } catch (error) {
      Alert.alert('Somethings wrong!');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: appTheme.colors.background },]}>
      <AppText variant='h1' style={styles.title}>Sign In</AppText>
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
          <AppText style={[ styles.forgotPassword, { color: appTheme.colors.primaryLight }, ]}>Forgot your password?</AppText>
        </TouchableOpacity>

        {/* Sign In Button */}
        <PrimaryButton
          title={formik.isSubmitting ? 'Signing in...' : 'Sign In'}
          onPress={formik.handleSubmit}
          accessibilityLabel="Submitting Login Form"
        />
        
        {/* Sign Up Link */}
        <View style={styles.signupContainer}>
          <AppText secondary variant='caption'>Don’t have an account?{' '}</AppText>
          <TouchableOpacity onPress={handlePress}>
            <AppText variant='small' style={ { color: appTheme.colors.primaryLight }}>Sign up</AppText>
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
    padding: 20,
  },
  title: {
    lineHeight: 56,
    textAlign: 'center',
    marginBottom: 40,
  },
  formContainer: {
    width: '100%',
    padding: 10,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
});
