import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MyTicketsScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Feature coming soon</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    text: {
        fontSize: 20,
        color: '#606060',
    }
});

export default MyTicketsScreen;
