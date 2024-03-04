import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import Header from './Components/Header'; 
import Footer from './Components/Footer'; 
import Calendar from './Components/Calendar';

const App = () => {
  return (
    <SafeAreaProvider>
      <Header/>
      <Calendar/>
      <View style={styles.footerContainer}>
            <Footer />
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2F3855',
  },
  footerContainer: {
    flex: 0.1,
  },
});

export default App;