import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import auth from '@react-native-firebase/auth';
import PrimaryButton from '../components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import GradientInput from '../components/GradientInput';

const SignupScreen = () => {
  type OnBoardingScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'Signup'
  >;

  const navigation = useNavigation<OnBoardingScreenNavigationProp>();

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
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string()
        .min(6, 'Must be at least 6 characters')
        .required('Required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const userCredential = await auth().createUserWithEmailAndPassword(
          values.email,
          values.password,
        );
        await userCredential.user.updateProfile({ displayName: values.name });
        Alert.alert('Success', 'Account created successfully', [
          { text: 'OK', onPress: () => navigation.navigate('Home') },
        ]);
      } catch (err) {
        console.error(err);
        let errorMessage = 'Something went wrong. Please try again later.';

        if (err instanceof Error) {
          // Optionally, log the raw error
          console.log('Error message:', err.message);
          errorMessage = err.message;
        }

        // Firebase-specific narrowing
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
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
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

        <PrimaryButton
          title={formik.isSubmitting ? 'Signing Up...' : 'Sign Up'}
          onPress={formik.handleSubmit}
          accessibilityLabel="Submitting Signup Form"
        />

        {/* Sign In Link */}
        <View style={styles.signupContainer}>
          <Text>Already have an account? </Text>
          <TouchableOpacity onPress={handlePress}>
            <Text style={styles.signupText}>Sign in</Text>
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
