import {
  StatusBar,
  useColorScheme,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import LoginScreen from './src/screens/LoginScreen';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <LoginScreen />
  );
}


export default App;
const style = StyleSheet.create({})
{/* <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} /> */}
      
    {/* </SafeAreaProvider> */}