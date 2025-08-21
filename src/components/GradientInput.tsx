import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';

interface GradientInputProps extends TextInputProps {
  error?: string;
}

const GradientInput: React.FC<GradientInputProps> = ({
  error,
  style,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={{ marginBottom: error ? 10 : 12 }}>
      <TextInput
        {...rest}
        style={[
          styles.input,
          style,
          { borderColor: error ? '#ff4d4d' : isFocused ? '#8a2be2' : '#ccc' },
          {marginBottom: error ? 2 : 10}
        ]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

export default GradientInput;

const styles = StyleSheet.create({
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderRadius: 8,
    borderWidth: 2,
    height: 50,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 2,
    marginLeft: 5,
  },
});
