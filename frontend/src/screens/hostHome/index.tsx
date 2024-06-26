import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { MainStackParamList } from '../../navigation/main';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';

const HostHomeScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

    const handleOnPress = () => {
        navigation.navigate("userView");
    };

    return (
        <View style={styles.container}>
            {/* <Text style={styles.text}>Feature coming soon</Text> */}
            <Button title="Switch View" onPress={handleOnPress} />
        </View>
    );
};

export default HostHomeScreen;
