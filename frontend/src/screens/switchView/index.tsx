import React from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/main';

const SwitchViewScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

    const hosts = ["banana", "apple", "orange"];

    const handlePress = (host: string) => {
        navigation.navigate('hostView', { hostId: host });
    };

    return (
        <View style={styles.container}>
            {hosts.map(host => (
                <View style={styles.buttonContainer} key={host}>
                    <Button
                        title={host.charAt(0).toUpperCase() + host.slice(1)}
                        onPress={() => handlePress(host)}
                    />
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    buttonContainer: {
        marginVertical: 10,
    }
});

export default SwitchViewScreen;
