import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getApp } from '@react-native-firebase/app';
import { getAuth} from '@react-native-firebase/auth';
import PrimaryButton from '../components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import GradientInput from '../components/GradientInput';
import { useTheme } from '../context/ThemeContext';
import { collection, getFirestore, serverTimestamp, setDoc } from '@react-native-firebase/firestore';
import AppText from '../components/AppText';


type SignUpScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Signup'
>;
const SignupScreen = () => {

  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const { appTheme } = useTheme();

  const app = getApp();
  const db = getFirestore(app);

  // Navigate to Login
  const handlePress = useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  // Formik Validation
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      username: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      username: Yup.string().matches(/^@[A-Za-z0-9_]+$/, 'Username must start with @ and contain only letters, numbers, or underscores').required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string()
        .min(6, 'Must be at least 6 characters')
        .required('Required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const userCredential = await getAuth(app).createUserWithEmailAndPassword(
          values.email,
          values.password,
        );
        const user = userCredential.user;

        await user.updateProfile({ displayName: values.name });
        const userRef = collection(db, 'users', user.uid);
        await setDoc(userRef, {
          userId: user.uid,
          name: values.name,
          username: values.username,
          email: user.email,
          bio: "This is my Profile Bio",
          avatar: null,
          totalPosts: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        Alert.alert('Success', 'Account created successfully', [
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

          if (errorCode === 'auth/email-already-in-use') {
            errorMessage = 'This email is already in use.';
          } else if (errorCode === 'auth/invalid-email') {
            errorMessage = 'Invalid email address.';
          } else if (errorCode === 'auth/weak-password') {
            errorMessage = 'Password must be at least 6 characters.';
          } else if (errorCode === 'auth/configuration-not') {
            errorMessage = 'Firebase authentication is not configured.';
          }
        }

        Alert.alert('OOPs! Signup Failed', errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <View style={[styles.container, { backgroundColor: appTheme.colors.background },]}>
      <AppText variant='h1' style={styles.title }>Sign Up</AppText>
      <View style={styles.formContainer}>

        {/* Name Input */}
        <GradientInput
          placeholder="Enter your name"
          value={formik.values.name}
          onChangeText={formik.handleChange('name')}
          onBlur={formik.handleBlur('name')}
          autoCapitalize="none"
          error={formik.touched.name ? formik.errors.name : ''}
        />

        {/* Username Input */}
        <GradientInput
          placeholder="@username"
          value={formik.values.username}
          onChangeText={formik.handleChange('username')}
          onBlur={formik.handleBlur('username')}
          autoCapitalize="none"
          error={formik.touched.username ? formik.errors.username : ''}
        />

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

        {/* Signup button */}
        <PrimaryButton
          title={formik.isSubmitting ? 'Signing Up...' : 'Sign Up'}
          onPress={formik.handleSubmit}
          accessibilityLabel="Submitting Signup Form"
        />

        {/* Sign In Link */}
        <View style={styles.signupContainer}>
          <AppText secondary variant='small'>Already have an account?{' '}</AppText>
          <TouchableOpacity onPress={handlePress}>
            <AppText variant='h2' style={{ color: appTheme.colors.primaryLight }}>Sign in</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SignupScreen;

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
    letterSpacing: 0,
    textAlign: 'center',
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
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
});
