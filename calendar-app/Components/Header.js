import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Poppins_700Bold } from '@expo-google-fonts/poppins';

const Header = () => {

    const [fontsLoaded] = useFonts({
        Poppins_700Bold,
    });

    const handleProfilePress = () => {
        console.log('Profile icon pressed');
    };

    return (
        <SafeAreaView edges={['right', 'top', 'left']} style={{ backgroundColor: '#2F3855' }}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Homee</Text>
                <TouchableOpacity onPress={handleProfilePress}>
                    <Avatar.Text size={40} label="VT" style={styles.avatar} />
                </TouchableOpacity>
            </View>
            <View style={styles.line} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#2F3855',
        marginTop: 10,
        paddingHorizontal: 30,
        paddingVertical: 10,
    },
    headerTitle: {
        fontFamily: 'Poppins_700Bold', 
        fontSize: 32,
        color: '#F4F4FC',
    },
    avatar: {
        backgroundColor: '#F4F4FC', 
    },
    line: {
        flex: 0,
        height: 2,
        backgroundColor: '#F4F4FC',
        marginHorizontal: 30,
    },
});

export default Header;