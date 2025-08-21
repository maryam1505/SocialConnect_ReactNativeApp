import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';

interface GradientInputProps extends TextInputProps {
  error?: string;
}

const GradientInput: React.FC<GradientInputProps> = ({ error, style, ...rest }) => {
  
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={{ marginBottom: error ? 5 : 15 }}>
      <LinearGradient
        colors={isFocused ? ['#ff00ff', '#8a2be2'] : ['#ccc', '#ccc']}
        style={styles.gradientBorder}
      >
      <View style={styles.innerContainer}>
          <TextInput
            {...rest}
            style={[styles.input, style]}
            onFocus={() => setIsFocused(true)}
          />
        </View>
      </LinearGradient>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

export default GradientInput;

const styles = StyleSheet.create({
  gradientBorder: {
    borderRadius: 10,
    padding: 2,
  },
  innerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  input: {
    height: 50,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    marginLeft: 5,
  },
});
