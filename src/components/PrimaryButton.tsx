import { StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ title, onPress, accessibilityLabel, style }) => {
  return (
    <TouchableOpacity onPress={onPress} accessibilityLabel={accessibilityLabel} style={[styles.touchableWrapper, style]}>
      <LinearGradient colors={['#200122', '#108DC7']} style={styles.button}>
        <Text style={styles.buttonText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({
  button: {
    width: '80%',
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  touchableWrapper: {
    width: '100%',
    alignItems: 'center',
  },
});
